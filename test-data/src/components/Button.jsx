import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Reusable Button component with multiple variants and states
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback((event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) {
      onClick(event);
    }
  }, [disabled, loading, onClick]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  }, [handleClick]);

  const getButtonClasses = () => {
    const baseClasses = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      className
    ];

    if (disabled) baseClasses.push('btn--disabled');
    if (loading) baseClasses.push('btn--loading');
    if (isPressed) baseClasses.push('btn--pressed');

    return baseClasses.filter(Boolean).join(' ');
  };

  return (
    <button
      className={getButtonClasses()}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-busy={loading}
      aria-disabled={disabled}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="btn__spinner-icon">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            />
          </svg>
        </span>
      )}
      
      {startIcon && !loading && (
        <span className="btn__icon btn__icon--start" aria-hidden="true">
          {startIcon}
        </span>
      )}
      
      <span className="btn__content">
        {children}
      </span>
      
      {endIcon && !loading && (
        <span className="btn__icon btn__icon--end" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'outline',
    'ghost'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;

// Example usage:
/*
<Button variant="primary" size="large" onClick={() => console.log('Clicked!')}>
  Click me
</Button>

<Button 
  variant="secondary" 
  startIcon={<SaveIcon />}
  loading={isLoading}
>
  Save Document
</Button>

<Button variant="danger" disabled>
  Delete
</Button>
*/