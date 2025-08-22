-- Database schema for deluminator scoreboard
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint on name to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_name ON scores(name);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scores_count ON scores(count DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);