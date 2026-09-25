import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useGlobalJobStats } from '../hooks/useJobs';
import { StatCard } from '../components/dashboard/StatCard';
import { StageDistributionChart } from '../components/dashboard/StageDistributionChart';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import {
  FiBriefcase,
  FiZap,
  FiCheckCircle,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiClock,
  FiArrowRight,
  FiAward
} from 'react-icons/fi';

const NEXT_ROUND_LABELS = {
  online_assessment: 'Online Assessment / Exam',
  technical_interview: 'Technical Interview',
  hr_screening: 'HR Screening',
  system_design: 'System Design',
  managerial: 'Managerial Round',
  final_round: 'Final Executive Call',
  assignment: 'Take-home Assignment',
  offer_discussion: 'Offer Discussion',
  none: 'Upcoming Event'
};

export const Dashboard = ({ onOpenCreateModal }) => {
  const { data: responseData, isLoading, error } = useAnalytics();
  const { data: globalStats } = useGlobalJobStats();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto py-8">
        <div className="h-8 w-48 bg-[#081210] rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-[#081210] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const analytics = responseData?.data || responseData || {};

  const totalApps = analytics.totalApps || 0;
  const totalApplied = analytics.totalApplied || 0;
  const responseRate = analytics.responseRate || 0;
  const avgDaysToReply = analytics.avgDaysToReply || 0;
  const stageDistribution = analytics.stageDistribution || [];
  const topCompanies = analytics.topCompanies || [];
  const upcomingRounds = analytics.upcomingRounds || [];

  const activePipeline = stageDistribution
    .filter(s => ['wishlist', 'applied', 'screening', 'interviewing'].includes(s._id))
    .reduce((acc, curr) => acc + curr.count, 0);

  const interviewCount = stageDistribution
    .filter(s => ['screening', 'interviewing'].includes(s._id))
    .reduce((acc, curr) => acc + curr.count, 0);

  const offerCount = stageDistribution
    .filter(s => ['offer', 'accepted'].includes(s._id))
    .reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#08100e] border border-[#00f5a0]/25 shadow-[0_0_30px_rgba(0,245,160,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f5a0] animate-ping" />
            <span className="text-[10px] font-mono text-[#00f5a0] uppercase tracking-wider">
              REAL-TIME ASPIRANT COMMAND CENTER
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Aspirant Pipeline Analytics
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Live overview of your job search pipeline, scheduled coding exams, upcoming interviews, and offer status.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            + Track Application
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tracked"
          value={totalApps}
          subtext="Applications logged in your pipeline"
          icon={FiBriefcase}
          color="emerald"
        />
        <StatCard
          title="Active Pipeline"
          value={activePipeline}
          subtext="Applied, Screening & Interviews"
          icon={FiZap}
          color="emerald"
        />
        <StatCard
          title="Interviews Active"
          value={interviewCount}
          subtext="Screening & Technical Rounds"
          icon={FiCheckCircle}
          color="emerald"
        />
        <StatCard
          title="Offers / Accepted"
          value={offerCount}
          subtext={`Avg Response: ${avgDaysToReply || 10} days`}
          icon={FiDollarSign}
          color="emerald"
        />
      </div>

      {/* UPCOMING EXAM / INTERVIEW RADAR WIDGET */}
      <div className="p-6 rounded-3xl bg-[#08100e] border border-[#00f5a0]/25 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <FiCalendar className="text-[#00f5a0]" /> Scheduled Exams & Upcoming Rounds ({upcomingRounds.length})
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Never miss a coding assessment or panel interview deadline.
            </p>
          </div>
          <Link
            to="/applications"
            className="text-xs font-mono text-[#00f5a0] hover:underline flex items-center gap-1"
          >
            View All Applications <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingRounds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {upcomingRounds.map((round) => (
              <div
                key={round._id}
                className="p-4 rounded-2xl bg-[#040807] border border-white/10 hover:border-[#00f5a0]/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">{round.company}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f5a0]/15 text-[#00f5a0] border border-[#00f5a0]/30 font-bold">
                    {NEXT_ROUND_LABELS[round.nextRoundType] || round.nextRoundType}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{round.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1 text-[#00f5a0]">
                    <FiClock className="w-3 h-3" /> {formatDate(round.nextRoundDate)}
                  </span>
                  <Link to={`/applications/${round._id}`} className="text-gray-300 hover:text-white underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-white/10 rounded-2xl text-xs text-gray-500 font-mono">
            No exams or interviews scheduled. Open any application to record your next interview date!
          </div>
        )}
      </div>

      {/* Stage Distribution Chart & Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#08100e] border border-white/10">
          <h3 className="text-base font-bold text-white mb-1 font-mono uppercase tracking-wider">
            Pipeline Stage Breakdown
          </h3>
          <p className="text-xs text-gray-400 mb-4">Distribution of applications across stages</p>
          <StageDistributionChart data={stageDistribution} />
        </div>

        <div className="p-6 rounded-3xl bg-[#08100e] border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 font-mono uppercase tracking-wider">
              Top Targeted Companies
            </h3>
            <p className="text-xs text-gray-400 mb-4">Organizations where you have active pursuits</p>
            {topCompanies.length > 0 ? (
              <div className="space-y-2.5">
                {topCompanies.map((comp, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#040807] border border-white/5 flex items-center justify-between"
                  >
                    <span className="font-bold text-sm text-white">{comp.company}</span>
                    <span className="text-xs text-[#00f5a0] font-mono font-bold">{comp.count} Applications</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-mono italic py-8 text-center">
                Track more applications to see your top company analytics.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Verified Postings Available:</span>
            <span className="text-[#00f5a0] font-bold">{globalStats?.totalJobs || '120+'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
