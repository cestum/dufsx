#!/usr/bin/env python3
"""
Sample Python file for testing syntax highlighting
This file demonstrates various Python syntax elements
"""

import os
import sys
import json
import asyncio
from typing import List, Dict, Optional, Union, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path

# Constants and module-level variables
API_VERSION = "1.0.0"
DEFAULT_TIMEOUT = 30
DEBUG_MODE = os.getenv("DEBUG", "false").lower() == "true"

# Type aliases
UserData = Dict[str, Union[str, int, bool]]
ConfigDict = Dict[str, Union[str, int, List[str]]]


@dataclass
class User:
    """Data class representing a user."""
    id: int
    name: str
    email: str
    active: bool = True
    created_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
    
    @property
    def display_name(self) -> str:
        """Return formatted display name."""
        return f"{self.name} ({self.email})"
    
    def to_dict(self) -> Dict[str, Union[str, int, bool]]:
        """Convert user to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class UserManager:
    """Manages user operations with caching and validation."""
    
    def __init__(self, database_url: str, cache_size: int = 100):
        self.database_url = database_url
        self.cache_size = cache_size
        self._cache: Dict[int, User] = {}
        self._stats = {'hits': 0, 'misses': 0}
    
    def __len__(self) -> int:
        """Return number of cached users."""
        return len(self._cache)
    
    def __contains__(self, user_id: int) -> bool:
        """Check if user is in cache."""
        return user_id in self._cache
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format using simple regex."""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @classmethod
    def from_config(cls, config: ConfigDict) -> 'UserManager':
        """Create UserManager from configuration dictionary."""
        return cls(
            database_url=config['database_url'],
            cache_size=config.get('cache_size', 100)
        )
    
    def _update_stats(self, hit: bool) -> None:
        """Update cache statistics."""
        if hit:
            self._stats['hits'] += 1
        else:
            self._stats['misses'] += 1
    
    def get_user(self, user_id: int) -> Optional[User]:
        """Get user by ID with caching."""
        if user_id in self._cache:
            self._update_stats(True)
            return self._cache[user_id]
        
        self._update_stats(False)
        # Simulate database fetch
        user = self._fetch_from_database(user_id)
        
        if user and len(self._cache) < self.cache_size:
            self._cache[user_id] = user
        
        return user
    
    def _fetch_from_database(self, user_id: int) -> Optional[User]:
        """Simulate fetching user from database."""
        # This would normally make a database call
        sample_users = {
            1: User(1, "Alice Johnson", "alice@example.com"),
            2: User(2, "Bob Smith", "bob@example.com"),
            3: User(3, "Charlie Brown", "charlie@example.com", False)
        }
        return sample_users.get(user_id)
    
    def create_user(self, name: str, email: str) -> User:
        """Create a new user with validation."""
        if not name or not name.strip():
            raise ValueError("Name cannot be empty")
        
        if not self.validate_email(email):
            raise ValueError(f"Invalid email format: {email}")
        
        # Generate new ID (simplified)
        new_id = max(self._cache.keys(), default=0) + 1
        user = User(new_id, name.strip(), email.lower())
        
        if len(self._cache) < self.cache_size:
            self._cache[new_id] = user
        
        return user
    
    def update_user(self, user_id: int, **kwargs) -> bool:
        """Update user with provided fields."""
        user = self.get_user(user_id)
        if not user:
            return False
        
        for field, value in kwargs.items():
            if hasattr(user, field):
                if field == 'email' and not self.validate_email(value):
                    raise ValueError(f"Invalid email format: {value}")
                setattr(user, field, value)
        
        return True
    
    def get_active_users(self) -> List[User]:
        """Get all active users from cache."""
        return [user for user in self._cache.values() if user.active]
    
    def get_stats(self) -> Dict[str, Union[int, float]]:
        """Get cache statistics."""
        total = self._stats['hits'] + self._stats['misses']
        hit_rate = self._stats['hits'] / total if total > 0 else 0.0
        
        return {
            'cache_size': len(self._cache),
            'hits': self._stats['hits'],
            'misses': self._stats['misses'],
            'hit_rate': round(hit_rate, 2)
        }


# Decorator functions
def retry(max_attempts: int = 3, delay: float = 1.0):
    """Retry decorator with exponential backoff."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    print(f"Attempt {attempt + 1} failed: {e}")
                    time.sleep(delay * (2 ** attempt))
        return wrapper
    return decorator


def log_execution_time(func):
    """Decorator to log function execution time."""
    import time
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            print(f"{func.__name__} executed in {execution_time:.4f} seconds")
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            print(f"{func.__name__} failed after {execution_time:.4f} seconds: {e}")
            raise
    return wrapper


# Async functions
async def fetch_user_data(user_id: int) -> Optional[Dict]:
    """Async function to fetch user data."""
    await asyncio.sleep(0.1)  # Simulate network delay
    
    user_manager = UserManager("sqlite:///users.db")
    user = user_manager.get_user(user_id)
    
    if user:
        return user.to_dict()
    return None


async def process_users_batch(user_ids: List[int]) -> List[Dict]:
    """Process multiple users concurrently."""
    tasks = [fetch_user_data(user_id) for user_id in user_ids]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter out None results and exceptions
    valid_results = []
    for result in results:
        if isinstance(result, dict):
            valid_results.append(result)
        elif isinstance(result, Exception):
            print(f"Error processing user: {result}")
    
    return valid_results


# Utility functions with various Python features
def load_config(config_path: Union[str, Path]) -> ConfigDict:
    """Load configuration from JSON file."""
    path = Path(config_path)
    
    if not path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    
    try:
        with path.open('r', encoding='utf-8') as f:
            config = json.load(f)
        
        # Validate required fields
        required_fields = ['database_url']
        missing_fields = [field for field in required_fields if field not in config]
        
        if missing_fields:
            raise ValueError(f"Missing required config fields: {missing_fields}")
        
        return config
    
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in config file: {e}")


def generate_report(users: List[User]) -> str:
    """Generate user report with statistics."""
    if not users:
        return "No users found."
    
    total_users = len(users)
    active_users = sum(1 for user in users if user.active)
    inactive_users = total_users - active_users
    
    # Using f-strings and multiline strings
    report = f"""
User Report - Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
{'=' * 50}

Total Users: {total_users}
Active Users: {active_users} ({active_users/total_users*100:.1f}%)
Inactive Users: {inactive_users} ({inactive_users/total_users*100:.1f}%)

Recent Users (created in last 7 days):
"""
    
    # List comprehension with conditional
    recent_cutoff = datetime.now() - timedelta(days=7)
    recent_users = [
        user for user in users 
        if user.created_at and user.created_at > recent_cutoff
    ]
    
    if recent_users:
        for user in recent_users:
            days_ago = (datetime.now() - user.created_at).days
            report += f"  - {user.display_name} (created {days_ago} days ago)\n"
    else:
        report += "  No recent users\n"
    
    return report


# Context manager
class DatabaseConnection:
    """Context manager for database connections."""
    
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.connection = None
    
    def __enter__(self):
        print(f"Connecting to database: {self.connection_string}")
        # Simulate connection
        self.connection = {"status": "connected"}
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection")
        if exc_type:
            print(f"Exception occurred: {exc_type.__name__}: {exc_val}")
        self.connection = None
        return False  # Don't suppress exceptions


# Main execution
def main():
    """Main function demonstrating various Python features."""
    try:
        # Dictionary and list comprehensions
        config = {
            'database_url': 'sqlite:///test.db',
            'cache_size': 50,
            'debug': DEBUG_MODE
        }
        
        # Create user manager
        user_manager = UserManager.from_config(config)
        
        # Create sample users
        sample_data = [
            ("Alice Johnson", "alice@example.com"),
            ("Bob Smith", "bob@example.com"),
            ("Charlie Brown", "charlie@example.com"),
        ]
        
        users = []
        for name, email in sample_data:
            try:
                user = user_manager.create_user(name, email)
                users.append(user)
                print(f"Created user: {user.display_name}")
            except ValueError as e:
                print(f"Failed to create user {name}: {e}")
        
        # Test caching
        for i in range(1, 4):
            user = user_manager.get_user(i)
            if user:
                print(f"Retrieved user: {user.display_name}")
        
        # Generate and print report
        report = generate_report(users)
        print(report)
        
        # Print statistics
        stats = user_manager.get_stats()
        print(f"Cache statistics: {stats}")
        
        # Async example
        if len(users) > 0:
            user_ids = [user.id for user in users]
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                batch_results = loop.run_until_complete(process_users_batch(user_ids))
                print(f"Processed {len(batch_results)} users asynchronously")
            finally:
                loop.close()
        
        # Context manager example
        with DatabaseConnection(config['database_url']) as conn:
            print(f"Database connection status: {conn['status']}")
    
    except Exception as e:
        print(f"Error in main: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()


# Multiple assignment and unpacking
coordinates = (10, 20, 30)
x, y, z = coordinates

# Lambda functions and functional programming
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
sum_all = reduce(lambda x, y: x + y, numbers, 0)

# Set operations
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}
intersection = set_a & set_b
union = set_a | set_b
difference = set_a - set_b

"""
This Python file demonstrates:
- Classes and dataclasses
- Type hints and annotations
- Async/await functionality
- Decorators (built-in and custom)
- Context managers
- Exception handling
- List/dict comprehensions
- F-strings and string formatting
- File I/O operations
- Functional programming concepts
- Property decorators
- Static and class methods
- Magic methods (__len__, __contains__, etc.)
"""