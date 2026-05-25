import React from 'react';
import { 
  Zap, 
  BarChart2, 
  Cpu, 
  Search, 
  Download, 
  MessageSquareCode 
} from 'lucide-react';

export const Features: React.FC = () => {
  const featuresList = [
    {
      icon: <Zap style={{ color: 'var(--primary)' }} size={32} />,
      title: "Concurrent Social Aggregation",
      desc: "Retrieve synchronized web elements across Reddit threads, YouTube media structures, Wikipedia text, and general web databases parallelly in single requests, bypassing slow sequential scrapes."
    },
    {
      icon: <BarChart2 style={{ color: 'var(--secondary)' }} size={32} />,
      title: "Accurate Sentiment Ratios",
      desc: "Our optimized prompt pipelines extract strict Positive, Neutral, and Negative sentiments from real text feeds, displaying interactive visual distributions rather than random guesses."
    },
    {
      icon: <Cpu style={{ color: '#ec4899' }} size={32} />,
      title: "One-Shot Gemini Synthesis",
      desc: "Generate comprehensive explanations, commercial appraisals, and public feedback analyses in single unified LLM requests, bringing latency down from minutes to seconds."
    },
    {
      icon: <Search style={{ color: '#f59e0b' }} size={32} />,
      title: "Scraped Data Inspector",
      desc: "Drill down into the actual scraping products! Confirm analytical reliability by reading the titles, upvotes, views, links, and snippets of the raw source data in our interactive Inspector."
    },
    {
      icon: <Download style={{ color: '#3b82f6' }} size={32} />,
      title: "Markdown Report Exports",
      desc: "Compile all AI analyses, graphs, sentiment summaries, and clickable source links into professional, beautifully styled Markdown documents to save and share instantly."
    },
    {
      icon: <MessageSquareCode style={{ color: '#14b8a6' }} size={32} />,
      title: "Grounded Chat Copilot",
      desc: "Discuss results in real-time with an intelligent AI chat helper. It maintains strict session boundaries, answering questions based exclusively on the scraped content."
    }
  ];

  return (
    <section id="features" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.8rem', fontFamily: 'var(--font-heading)' }}>
          High-Velocity Social Auditing Features
        </h2>
        <p style={{ color: 'var(--neutral-mid)', maxWidth: '600px', margin: '0 auto', fontSize: '0.98rem' }}>
          Discover the technology stack driving HighPulse.ai to deliver zero-latency market intelligence.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {featuresList.map((item, idx) => (
          <div key={idx} className="card-glass" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              padding: '0.6rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)'
            }}>
              {item.icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'white', fontFamily: 'var(--font-heading)' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--neutral-mid)', lineHeight: 1.6 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
