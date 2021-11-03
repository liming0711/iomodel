import React from 'react';
import './style.less';

interface PanelProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean; // title 是否居中
  wrapClassName?: string;
}

const Panel: React.FC<PanelProps> = (props) => {
  const { title, subtitle, center, wrapClassName, children } = props;
  return (
    <div className="panel-wrapper">
      <div className={`panel-header ${center ? 'center' : ''}`}>{title}</div>
      {
        subtitle ? (
          <div className="panel-subtitle">{subtitle}</div>
        ) : null
      }
      <div className={`${wrapClassName ? wrapClassName : ''} panel-content`}>{children}</div>
    </div>
  );
};

export default Panel;
