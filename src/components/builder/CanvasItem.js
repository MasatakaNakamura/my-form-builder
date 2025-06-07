import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { ItemTypes } from './ToolboxItem'; // 同じタイプを共有

// キャンバス内の部品を表すコンポーネント
const ComponentPreview = ({ type, properties, onPropertyChange }) => {
  switch (type) {
    case 'TEXT_INPUT':
      return (
        <TextField
          label="ラベル"
          value={properties.label}
          onChange={(e) => onPropertyChange('label', e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          helperText="テキスト入力のプレビュー"
        />
      );
    case 'TEXT_AREA':
        return (
          <TextField
            label="ラベル"
            value={properties.label}
            onChange={(e) => onPropertyChange('label', e.target.value)}
            variant="outlined"
            size="small"
            multiline
            rows={3}
            fullWidth
            helperText="テキストエリアのプレビュー"
          />
        );
    case 'CHECKBOX':
      return (
        <TextField
          label="ラベル"
          value={properties.label}
          onChange={(e) => onPropertyChange('label', e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{ readOnly: true }}
          helperText="チェックボックスのプレビュー"
        />
      );
    case 'RADIO_GROUP':
      return (
         <TextField
          label="ラベル"
          value={properties.label}
          onChange={(e) => onPropertyChange('label', e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          helperText={`ラジオボタンのプレビュー (選択肢: ${properties.options.join(', ')})`}
        />
      );
    default:
      return <Typography>未定義の部品</Typography>;
  }
};


function CanvasItem({ id, index, component, onMove, onUpdate }) {
  const ref = useRef(null);

  // ドロップターゲット（他のCanvasItemを受け入れる）の設定
  const [, drop] = useDrop({
    accept: ItemTypes.COMPONENT,
    hover(item) {
      if (!ref.current) return;
      if (item.type) return; // Toolboxからのアイテムは無視
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;
      
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // ドラッグソース（自分自身をドラッグ可能にする）の設定
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COMPONENT,
    item: { id, index }, // 並び替えに使うため、自身のIDと現在のインデックスを渡す
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 参照をdragとdropの両方にアタッチ
  drag(drop(ref));
  
  const handlePropertyChange = (key, value) => {
    onUpdate(id, { ...component.properties, [key]: value });
  };

  return (
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        p: 2,
        mb: 1.5,
        cursor: 'move',
        opacity: isDragging ? 0.3 : 1,
        border: '2px solid #1976d2', // 選択されている感を出す
      }}
    >
      <ComponentPreview 
        type={component.type} 
        properties={component.properties}
        onPropertyChange={handlePropertyChange}
      />
    </Paper>
  );
}

export default CanvasItem;