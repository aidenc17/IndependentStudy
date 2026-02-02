import React from 'react';
import { WeeklyReportData } from '../types';

interface ReportListProps {
  reports: WeeklyReportData[];
}

const ReportList: React.FC<ReportListProps> = ({ reports }) => {
  return (
    <div>
      <h2>Weekly Reports</h2>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            <h3>Date: {report.date}</h3>
            <p><strong>Work Completed:</strong> {report.workCompleted}</p>
            <p><strong>Challenges Faced:</strong> {report.challengesFaced}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;