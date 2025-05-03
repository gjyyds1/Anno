'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface FeedbackFormProps {
  type: 'idea' | 'bug';
}

export default function FeedbackForm({ type }: FeedbackFormProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = async () => {
    if (!content.trim() || !playerName.trim()) {
      alert('请填写完整信息');
      return;
    }

    const endpoint = type === 'idea' ? '/api/ideas' : '/api/bugs';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          playerName,
        }),
      });

      if (response.ok) {
        alert('提交成功');
        setContent('');
        setPlayerName('');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请稍后重试');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/')}
              sx={{ mr: 2 }}
            >
              返回
            </Button>
            <Typography variant="h5">
              {type === 'idea' ? '提交新想法' : '提交Bug反馈'}
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={6}
            label={type === 'idea' ? '你的想法' : 'Bug描述'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="玩家名"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit} size="large">
              提交
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}