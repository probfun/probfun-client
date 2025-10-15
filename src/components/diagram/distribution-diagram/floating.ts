// utils/floating.ts
import type { GraphNode, Position, XYPosition } from '@vue-flow/core';
import { Position as PosEnum } from '@vue-flow/core';

function getAbsPos(n: GraphNode) {
  const p = (n as any).positionAbsolute ?? n.computedPosition;
  return { x: p.x, y: p.y };
}

export function getNodeCenter(n: GraphNode): XYPosition {
  const { x, y } = getAbsPos(n);
  const w = n.dimensions?.width ?? 0;
  const h = n.dimensions?.height ?? 0;
  return { x: x + w / 2, y: y + h / 2 };
}

/**
 * 计算从 node 中心指向 point 的射线与 node 外接矩形的交点。
 * 这个算法用 max(|dx|/hw, |dy|/hh) 做缩放，数值更稳，不会“跑出矩形”。
 */
export function getIntersection(node: GraphNode, point: XYPosition): { x: number; y: number; position: Position } {
  const { x: nx, y: ny } = getAbsPos(node);
  const w = node.dimensions?.width ?? 0;
  const h = node.dimensions?.height ?? 0;

  // 尺寸未测到时，给个保守默认值，避免 0 导致奇怪结果
  const hw = (w || (node as any).width || 180) / 2;
  const hh = (h || (node as any).height || 36) / 2;

  const cx = nx + hw;
  const cy = ny + hh;

  const dx = point.x - cx;
  const dy = point.y - cy;

  // 指向自身中心：直接落在最靠近对方的边（这里返回中心也行）
  if (dx === 0 && dy === 0) {
    return { x: cx, y: cy, position: PosEnum.Bottom };
  }

  // 缩放到触到矩形边界
  const scale = Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh) || 1;
  const ix = cx + dx / scale;
  const iy = cy + dy / scale;

  // 判断落在什么边：用接近度来判定，避免数值误差
  const eps = 0.5;
  let pos: Position;
  if (Math.abs(ix - (cx + hw)) <= eps)
    pos = PosEnum.Right;
  else if (Math.abs(ix - (cx - hw)) <= eps)
    pos = PosEnum.Left;
  else if (Math.abs(iy - (cy + hh)) <= eps)
    pos = PosEnum.Bottom;
  else pos = PosEnum.Top;

  return { x: ix, y: iy, position: pos };
}
