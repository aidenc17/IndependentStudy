import React, { useState } from 'react';

const ReportForm: React.FC<{ onSubmit: (report: { workCompleted: string; challengesFaced: string; date: string }) => void }> = ({ onSubmit }) => {
    const [workCompleted, setWorkCompleted] = useState('');
    const [challengesFaced, setChallengesFaced] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ workCompleted, challengesFaced, date });
        setWorkCompleted('');
        setChallengesFaced('');
        setDate('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="workCompleted">Work Completed:</label>
                <textarea
                    id="workCompleted"
                    value={workCompleted}
                    onChange={(e) => setWorkCompleted(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="challengesFaced">Challenges Faced:</label>
                <textarea
                    id="challengesFaced"
                    value={challengesFaced}
                    onChange={(e) => setChallengesFaced(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Submit Report</button>
        </form>
    );
};

export default ReportForm;