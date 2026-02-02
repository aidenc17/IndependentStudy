import React from 'react';
import WeeklyReport from '../components/WeeklyReport';
import ReportList from '../components/ReportList';

const Reports: React.FC = () => {
    return (
        <div>
            <h1>Weekly Reports</h1>
            <WeeklyReport />
            <ReportList />
        </div>
    );
};

export default Reports;