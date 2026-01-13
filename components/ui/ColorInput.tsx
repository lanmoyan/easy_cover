import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils'; // 项目通用的classNames工具函数

// 校验色码是否合法（支持Hex、RGB）
const isValidColor = (color: string): boolean => {
  if (!color) return false;
  // Hex格式：#fff / #ffffff
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  // RGB格式：rgb(255,255,255) / rgb(255, 255, 255)
  const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
  return hexRegex.test(color) || rgbRegex.test(color);
};

// 色码格式化（简写Hex补全为完整格式，如#f00 → #ff0000）
const formatColorCode = (color: string): string => {
  if (/^#([0-9A-Fa-f]{3})$/.test(color)) {
    const hex = color.slice(1);
    return `#${hex.split('').map(c => c + c).join('')}`;
  }
  return color;
};

interface ColorInputProps {
  value: string; // 当前颜色值
  onChange: (color: string) => void; // 颜色变更回调
  label?: string; // 输入框标签
  className?: string; // 自定义样式
}

export const ColorInput = ({ value, onChange, label, className }: ColorInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isInvalid, setIsInvalid] = useState(false);

  // 同步外部value到输入框
  useEffect(() => {
    setInputValue(value);
    setIsInvalid(false);
  }, [value]);

  // 输入框变更处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    setInputValue(input);
    
    // 实时校验，合法则同步状态
    if (isValidColor(input)) {
      const formattedColor = formatColorCode(input);
      onChange(formattedColor);
      setIsInvalid(false);
    } else {
      setIsInvalid(input !== ''); // 空输入不标红
    }
  };

  // 原生颜色选择器变更处理
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    onChange(color);
    setInputValue(color);
    setIsInvalid(false);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex gap-2 items-center">
        {/* 色码输入框 */}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="输入#Hex或RGB色码（如#fff）"
          className={cn({
            "border-red-500 focus:ring-red-500": isInvalid,
            "border-gray-300 focus:ring-blue-500": !isInvalid,
          })}
          maxLength={20}
        />
        {/* 原生颜色选择器（视觉辅助） */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <input
                type="color"
                value={value.startsWith('#') ? value : '#ffffff'} // 仅支持Hex的颜色选择器兜底
                onChange={handleColorPickerChange}
                className="w-10 h-10 rounded-full cursor-pointer border-0 p-0"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>选择颜色</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {isInvalid && <p className="text-xs text-red-500">请输入合法的色码（如#ffffff或rgb(255,255,255)）</p>}
    </div>
  );
};
