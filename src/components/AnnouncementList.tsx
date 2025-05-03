'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface Announcement {
  title: string;
  date: string;
  content: string;
  filename: string;
}

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('加载公告失败:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (announcements.length === 0) {
    return (
      <Box p={4}>
        <Typography variant="h6" textAlign="center" color="text.secondary">
          暂无公告
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {announcements.map((announcement, index) => (
        <Card key={announcement.filename} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {announcement.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {new Date(announcement.date).toLocaleDateString('zh-CN')}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <ReactMarkdown>{announcement.content}</ReactMarkdown>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}