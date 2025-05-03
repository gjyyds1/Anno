import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    <Box>
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

      {/* 公告详情弹窗 */}
      <Dialog
        open={selectedAnnouncement !== null}
        onClose={() => setSelectedAnnouncement(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selectedAnnouncement && announcements
          .filter(a => a.filename === selectedAnnouncement)
          .map(announcement => (
            <Box key={announcement.filename}>
              <DialogTitle sx={{ pr: 6 }}>
                {announcement.title}
                <IconButton
                  aria-label="关闭"
                  onClick={() => setSelectedAnnouncement(null)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Typography color="text.secondary" gutterBottom>
                  {new Date(announcement.date).toLocaleDateString('zh-CN')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <ReactMarkdown>{announcement.content}</ReactMarkdown>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedAnnouncement(null)}>关闭</Button>
              </DialogActions>
            </Box>
          ))
        }
      </Dialog>
    </Box>
  );
}