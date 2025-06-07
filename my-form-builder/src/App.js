import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import FormBuilder from './components/FormBuilder';
import FormRenderer from './components/FormRenderer';

// サポートするフォーム部品の種類を定義
const initialToolboxItems = [
  { type: 'TEXT_INPUT', label: 'テキスト入力' },
  { type: 'TEXT_AREA', label: 'テキストエリア' },
  { type: 'CHECKBOX', label: 'チェックボックス' },
  { type: 'RADIO_GROUP', label: 'ラジオボタン' },
];

function App() {
  // キャンバス上のフォーム部品のリストをStateで管理
  const [formComponents, setFormComponents] = useState([]);

  // ツールボックスからキャンバスへ部品がドロップされた時の処理
  const handleDrop = useCallback((item) => {
    const newComponent = {
      id: uuidv4(), // 一意なIDを生成
      type: item.type,
      // 部品の種類に応じたデフォルトプロパティを設定
      properties: {
        label: `新しい${item.label}`,
        ...(item.type === 'RADIO_GROUP' && { options: ['選択肢1', '選択肢2'] }),
      },
    };
    setFormComponents((prev) => [...prev, newComponent]);
  }, []);

  // キャンバス上の部品を並び替える処理
  const moveComponent = useCallback((dragIndex, hoverIndex) => {
    setFormComponents((prev) => {
      const newComponents = [...prev];
      const [draggedItem] = newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, draggedItem);
      return newComponents;
    });
  }, []);
  
  // 部品のプロパティを更新する処理
  const updateComponentProperties = useCallback((id, newProperties) => {
    setFormComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, properties: newProperties } : comp
      )
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          WEBテンプレート提供システム (React サンプル)
        </Typography>
        <Grid container spacing={3}>
          {/* 左側: フォームビルダー */}
          <Grid item xs={12} md={8}>
            <FormBuilder
              toolboxItems={initialToolboxItems}
              formComponents={formComponents}
              onDrop={handleDrop}
              onMove={moveComponent}
              onUpdate={updateComponentProperties}
            />
          </Grid>

          {/* 右側: プレビューとJSON */}
          <Grid item xs={12} md={4}>
            {/* フォームレンダラー */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                フォームプレビュー
              </Typography>
              <FormRenderer formDefinition={formComponents} />
            </Paper>

            {/* JSON出力 */}
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                生成されたJSON
              </Typography>
              <Box
                component="pre"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  backgroundColor: '#f5f5f5',
                  p: 1,
                  borderRadius: 1,
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                {JSON.stringify(formComponents, null, 2)}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DndProvider>
  );
}

export default App;