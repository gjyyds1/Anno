import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface Announcement {
  title: string;
  date: string;
  content: string;
  filename: string;
}

export default function AnnouncementTabs() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);

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
    <Box display="flex" gap={2}>
      {/* 公告列表 */}
      <Box flex={1}>
        <List>
          {announcements.map((announcement) => (
            <Box key={announcement.filename}>
              <ListItem 
                button 
                onClick={() => setSelectedAnnouncement(announcement.filename)}
                selected={selectedAnnouncement === announcement.filename}
              >
                <Box>
                  <Typography variant="h6">
                    {announcement.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(announcement.date).toLocaleDateString('zh-CN')}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {announcement.content}
                  </Typography>
                </Box>
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      </Box>

      {/* 公告详情 */}
      <Box flex={2}>
        {selectedAnnouncement ? (
          <Card>
            <CardContent>
              {announcements
                .filter(a => a.filename === selectedAnnouncement)
                .map(announcement => (
                  <Box key={announcement.filename}>
                    <Typography variant="h5" gutterBottom>
                      {announcement.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {new Date(announcement.date).toLocaleDateString('zh-CN')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <ReactMarkdown>{announcement.content}</ReactMarkdown>
                    </Box>
                  </Box>
                ))
              }
            </CardContent>
          </Card>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="text.secondary">
              请选择一个公告查看详情
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}