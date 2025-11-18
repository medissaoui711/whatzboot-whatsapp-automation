import React from 'react';
import { createRoot } from 'react-dom/client';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
  body {
    background-color: #0D1117;
    color: #c9d1d9;
    font-family: 'Tajawal', sans-serif;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
  }
  .container {
    padding: 2rem;
    border: 1px solid #30363d;
    background-color: #161B22;
    border-radius: 8px;
    max-width: 600px;
    margin: 1rem;
  }
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
  }
  .brand {
    color: #25D366;
  }
  p {
    font-size: 1.1rem;
    color: #8b949e;
    line-height: 1.6;
  }
  .instructions {
    text-align: left;
    margin-top: 2rem;
    background-color: #010409;
    padding: 1.5rem;
    border-radius: 6px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 0.5rem;
  }
  pre {
      background-color: #0d1117;
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid #30363d;
      white-space: pre-wrap;
  }
  code {
    background-color: #30363d;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
  .folder {
      font-weight: bold;
      color: #34B7F1;
  }
`;

const App = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <h1>Welcome to <span className="brand">WhatzBoot</span></h1>
        <p>Your comprehensive dashboard for WhatsApp automation.</p>
        <div className="instructions">
            <p>This project is a monorepo containing:</p>
            <ul>
                <li>- A <strong className="folder">/frontend</strong> application built with Next.js.</li>
                <li>- A <strong className="folder">/backend</strong> API built with FastAPI.</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>To get started, please follow the setup instructions in the README files within each directory.</p>
            <p>To run the frontend:</p>
            <pre><code>cd frontend<br/>npm install<br/>npm run dev</code></pre>
        </div>
      </div>
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
