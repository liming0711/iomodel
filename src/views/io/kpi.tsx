import React from 'react';

const KPI: React.FC = () => {
  return (
    <div className="kpi-wrapper">
      <div className="kpi-container">
        <div className="kpi-item">
          <div className="kpi-item-title">JobID</div>
          <div className="kpi-item-content">123312</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-item-title">UID</div>
          <div className="kpi-item-content">1216</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-item-title">NPROCS</div>
          <div className="kpi-item-content">60</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-item-title">运行时间</div>
          <div className="kpi-item-content">1233秒</div>
        </div>
      </div>
    </div>
  );
};

export default KPI;
