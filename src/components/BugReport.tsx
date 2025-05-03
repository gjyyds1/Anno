import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Bug } from '@/types';

type BugStatus = 'open' | 'closed' | 'cannot' | 'fake' | 'feature' | 'ok';

const statusMap: Record<BugStatus, { label: string; color: 'error' | 'success' | 'warning' | 'info' }> = {
  open: { label: '未解决', color: 'error' },
  closed: { label: '无法解决', color: 'warning' },
  cannot: { label: '无法复现', color: 'info' },
  fake: { label: '假bug', color: 'info' },
  feature: { label: '特性', color: 'info' },
  ok: { label: '已解决', color: 'success' },
};

export default function BugReport() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [newContent, setNewContent] = useState('');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await fetch('/api/bugs');
      if (response.ok) {
        const data = await response.json();
        setBugs(data);
      }
    } catch (error) {
      console.error('获取bug列表失败:', error);
    }
  };

  const handleSubmit = async () => {
    if (!newContent.trim() || !playerName.trim()) {
      alert('请填写完整信息');
      return;
    }

    try {
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
          playerName,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setBugs([result, ...bugs]);
        setNewContent('');
        setPlayerName('');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请稍后重试');
    }
  };

  const handleStatusChange = async (bugId: string, newStatus: BugStatus) => {
    try {
      const response = await fetch(`/api/bugs/${bugId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedBug = await response.json();
        setBugs(bugs.map(bug => bug.id === bugId ? updatedBug : bug));
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新状态失败，请稍后重试');
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            提交Bug反馈
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Bug描述"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="玩家名"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmit}>
            提交
          </Button>
        </CardContent>
      </Card>

      <List>
        {bugs.map((bug, index) => (
          <Box key={bug.id}>
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="body1">{bug.id}</Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={bug.status}
                      onChange={(e) => handleStatusChange(bug.id, e.target.value as BugStatus)}
                      size="small"
                    >
                      {Object.entries(statusMap).map(([value, { label }]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Chip
                    label={statusMap[bug.status].label}
                    color={statusMap[bug.status].color}
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
    </Box>
  );
}