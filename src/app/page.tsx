'use client';

import { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import AnnouncementTabs from '@/components/AnnouncementTabs';
import FeedbackTabs from '@/components/FeedbackTabs';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="公告" />
        <Tab label="意见反馈" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 ? (
          <AnnouncementTabs />
        ) : (
          <FeedbackTabs />
        )}
      </Box>
    </Container>
  );
}