import React from 'react';
import { Clock, MoreVertical, CheckCircle2 } from 'lucide-react';
import { Experiment } from '../../types';

interface ExperimentLogsFeedProps {
  experiments: Experiment[];
}

export const ExperimentLogsFeed: React.FC<ExperimentLogsFeedProps> = ({ experiments = [] }) => {
  // Built-in standard entries matching the reference image layout
  const logEntries = [
    {
      title: 'Autokeras Structured',
      desc: 'Data regression of multi-objective parameters.',
      author: 'George Fields',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
      time: '1 day ago',
      status: 'Published',
    },
    {
      title: 'Kalloom Group Model',
      desc: 'Validation of regression on clinical targets.',
      author: 'Jeff Moon',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      time: '2 weeks ago',
      status: 'Published',
    },
    {
      title: 'XGBoost Hyper-Ensemble',
      desc: 'Gradient frontier exploration and tree regularization.',
      author: 'Andrew Mcgee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      time: '3 weeks ago',
      status: 'Published',
    },
    {
      title: 'Random Forest Baseline',
      desc: 'Anchor trial establishing baseline cross-entropy.',
      author: 'George Fields',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop&crop=face',
      time: '5 weeks ago',
      status: 'Published',
    },
    {
      title: 'Support Vector Machine (RBF)',
      desc: 'Nonlinear margin optimization across boundary manifolds.',
      author: 'George Fields',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
      time: '5 weeks ago',
      status: 'Published',
    },
    {
      title: 'Gradient Boosting Regressor',
      desc: 'Residual fitting with step-wise learning rate decay.',
      author: 'George Fields',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      time: '5 weeks ago',
      status: 'Published',
    },
  ];

  return (
    <div className="h-full w-full flex flex-col p-4 font-mono select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center space-x-2 text-white">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold font-sans">Logs</h3>
        </div>
        <button className="text-zinc-500 hover:text-white transition-all">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Log Feed Items */}
      <div className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
        {logEntries.map((log, index) => (
          <div
            key={index}
            className="pb-3 border-b border-white/5 last:border-b-0 space-y-2 hover:bg-white/[0.02] p-1.5 rounded transition-all"
          >
            {/* Title & Status Pill */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white font-sans tracking-wide">
                  {log.title}
                </h4>
                <p className="text-[10px] text-zinc-500 truncate max-w-[200px] mt-0.5">
                  {log.desc}
                </p>
              </div>

              <div className="px-2 py-0.5 rounded text-[9px] font-sans bg-zinc-800 text-zinc-300 border border-white/10 flex items-center space-x-1">
                <span>{log.status}</span>
                <CheckCircle2 className="w-2.5 h-2.5 text-zinc-400 fill-zinc-400" />
              </div>
            </div>

            {/* Author Avatar + Name + Time */}
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-500">By</span>
                <img
                  src={log.avatar}
                  alt={log.author}
                  className="w-5 h-5 rounded-full object-cover border border-white/10"
                />
                <span className="text-zinc-200 font-sans font-medium">{log.author}</span>
              </div>

              <div className="text-zinc-500 text-[9px] flex items-center space-x-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{log.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
