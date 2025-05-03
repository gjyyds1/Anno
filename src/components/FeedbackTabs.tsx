'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  Divider,
  Chip,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { Bug, Idea } from '@/types';
import { useRouter } from 'next/navigation';

export default function FeedbackTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const fetchData = async () => {
    try {
      const endpoint = activeTab === 0 ? '/api/ideas' : '/api/bugs';
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        if (activeTab === 0) {
          setIdeas(data);
        } else {
          setBugs(data);
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 每30秒刷新一次
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleNewFeedback = () => {
    const path = activeTab === 0 ? '/feedback/idea' : '/feedback/bug';
    router.push(path);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="想法" />
          <Tab label="Bug反馈" />
        </Tabs>
        <Button variant="contained" onClick={handleNewFeedback}>
          {activeTab === 0 ? '提交新想法' : '提交Bug反馈'}
        </Button>
      </Box>

      <List>
        {activeTab === 0
          ? ideas.map((idea, index) => (
              <Box key={idea.id}>
                <ListItem>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body1">{idea.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      提交者: {idea.playerName} | 
                      {new Date(idea.createdAt).toLocaleString('zh-CN')}
                    </Typography>
                  </Box>
                </ListItem>
                {index < ideas.length - 1 && <Divider />}
              </Box>
            ))
          : bugs.map((bug, index) => (
              <Box key={bug.id}>
                <ListItem>
                  <Box sx={{ width: '100%' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="body1">{bug.id}</Typography>
                      <Chip
                        label={bug.status === 'open' ? '未修复' : '已修复'}
                        color={bug.status === 'open' ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body1">{bug.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      提交者: {bug.playerName} | 
                      {new Date(bug.createdAt).toLocaleString('zh-CN')}
                    </Typography>
                  </Box>
                </ListItem>
                {index < bugs.length - 1 && <Divider />}
              </Box>
            ))}
      </List>
    </Container>
  );
}