ReactとReact DnDを使用したフォームビルダーのサンプルソースコード。
UIコンポーネントにはMUI (Material-UI) を、
一意なIDの生成には`uuid`ライブラリを併用。

このサンプルは、以下の主要な機能を持つ実践的な構成になっています。

1.  **ツールボックス**: ドラッグ可能なフォーム部品（テキスト入力、チェックボックス等）を配置します。
2.  **キャンバス**: ツールボックスから部品をドロップしてフォームを構築するエリアです。
3.  **並び替え**: キャンバスに配置した部品をドラッグ＆ドロップで並び替えできます。
4.  **プロパティ編集 (簡易版)**: 配置した部品のラベルなどを変更できます。
5.  **JSONプレビュー**: 構築したフォームの定義がリアルタイムでJSONとして表示されます。
6.  **フォームレンダラー**: 生成されたJSONを元に、実際の入力フォームを動的に描画します。

---

### 1. 必要なライブラリのインストール

まず、プロジェクトで以下のライブラリをインストールします。

```bash
# Reactのセットアップ (まだの場合)
npx create-react-app my-form-builder
cd my-form-builder

# 必要なライブラリをインストール
npm install @mui/material @emotion/react @emotion/styled
npm install react-dnd react-dnd-html5-backend
npm install uuid
```

---

### 2. サンプルソースコード

以下に各ファイルのソースコードを示します。この構成を参考に、ご自身のプロジェクトに組み込んでください。

#### `src/App.js`
アプリケーション全体を管理するメインコンポーネントです。フォーム定義のStateを持ち、各コンポーネントに渡します。

```jsx
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
```

#### `src/components/FormBuilder.js`
ツールボックスとキャンバスを組み合わせた、フォーム構築エリアのメインコンポーネントです。

```jsx
import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Toolbox from './builder/Toolbox';
import Canvas from './builder/Canvas';

function FormBuilder({ toolboxItems, formComponents, onDrop, onMove, onUpdate }) {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        フォームビルダー
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Toolbox items={toolboxItems} />
        </Grid>
        <Grid item xs={9}>
          <Canvas
            components={formComponents}
            onDrop={onDrop}
            onMove={onMove}
            onUpdate={onUpdate}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormBuilder;
```

#### `src/components/builder/Toolbox.js`
ドラッグ可能な部品がリストされているサイドバーです。

```jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ToolboxItem from './ToolboxItem';

function Toolbox({ items }) {
  return (
    <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        ツールボックス
      </Typography>
      {items.map((item) => (
        <ToolboxItem key={item.type} type={item.type} label={item.label} />
      ))}
    </Box>
  );
}

export default Toolbox;
```

#### `src/components/builder/ToolboxItem.js`
ツールボックス内の個々のドラッグ可能な部品です。`useDrag`フックを使用します。

```jsx
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
```

#### `src/components/builder/Canvas.js`
部品がドロップされる中心エリアです。`useDrop`フックでドロップを待ち受けます。

```jsx
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

```

#### `src/components/builder/CanvasItem.js`
キャンバス上に配置された個々の部品です。**並び替えのため、自身がドラッグ可能(`useDrag`)であり、かつ他の部品のドロップ先(`useDrop`)にもなる**、最も重要なコンポーネントです。

```jsx
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
```

#### `src/components/FormRenderer.js`
JSON定義を元に、ユーザーが実際に入力するフォームを描画するコンポーネントです。

```jsx
import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';

function FormRenderer({ formDefinition }) {
  if (!formDefinition || formDefinition.length === 0) {
    return <Box sx={{ color: 'grey.600' }}>プレビューするフォームがありません。</Box>;
  }

  return (
    <Box component="form" noValidate autoComplete="off">
      {formDefinition.map((comp) => {
        const { id, type, properties } = comp;

        switch (type) {
          case 'TEXT_INPUT':
            return (
              <TextField
                key={id}
                label={properties.label}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            );
          case 'TEXT_AREA':
            return (
                <TextField
                  key={id}
                  label={properties.label}
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                />
              );
          case 'CHECKBOX':
            return (
              <FormControlLabel
                key={id}
                control={<Checkbox />}
                label={properties.label}
                sx={{ display: 'block', mt: 1 }}
              />
            );
          case 'RADIO_GROUP':
            return (
              <FormControl key={id} component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend">{properties.label}</FormLabel>
                <RadioGroup>
                  {properties.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          default:
            return null;
        }
      })}
    </Box>
  );
}

export default FormRenderer;
```

---

### 3. 実行方法

1.  上記のファイルを`src`ディレクトリ以下の対応するパスに保存します。
2.  ターミナルで `npm start` を実行します。
3.  ブラウザが起動し、左側にツールボックスとキャンバス、右側にプレビューとJSONが表示されます。

これで、ご提案内容にあるシステムのフロントエンド部分のコア機能（ドラッグ＆ドロップによるフォーム構築）をReactで実現できます。このサンプルをベースに、プロパティ編集機能の拡充（選択肢の追加・削除など）や、バックエンドとのAPI連携を実装していくことになります。