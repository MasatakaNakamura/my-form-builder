import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, Typography } from '@mui/material';
import { ItemTypes } from './ToolboxItem';
import CanvasItem from './CanvasItem';

function Canvas({ components, onDrop, onMove, onUpdate }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item) => onDrop(item), // ToolboxItemがドロップされたらonDropを呼ぶ
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop} // この要素をドロップターゲットにする
      sx={{
        border: '1px solid #ccc',
        borderRadius: 1,
        p: 2,
        minHeight: '400px',
        backgroundColor: isOver ? '#e0e0e0' : '#fafafa',
        transition: 'background-color 0.2s',
      }}
    >
      {components.length === 0 ? (
        <Typography sx={{ color: 'grey.600', textAlign: 'center' }}>
          ここに部品をドラッグ＆ドロップしてください
        </Typography>
      ) : (
        components.map((component, index) => (
          <CanvasItem
            key={component.id}
            id={component.id}
            index={index}
            component={component}
            onMove={onMove}
            onUpdate={onUpdate}
          />
        ))
      )}
    </Box>
  );
}

export default Canvas;