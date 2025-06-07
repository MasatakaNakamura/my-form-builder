import React from 'react';
import { useDrag } from 'react-dnd';
import { Paper } from '@mui/material';

// DnDの識別に使うItemType
export const ItemTypes = {
  COMPONENT: 'component',
};

function ToolboxItem({ type, label }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    // ドラッグするデータ。ドロップ時にCanvasで受け取れる
    item: { type, label }, 
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Paper
      ref={drag} // この要素をドラッグ可能にする
      elevation={2}
      sx={{
        p: 1.5,
        mb: 1,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        textAlign: 'center',
      }}
    >
      {label}
    </Paper>
  );
}

export default ToolboxItem;