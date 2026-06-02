import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Cubes.css';

const Cubes = ({
  gridSize = 10,
  cubeSize,
  maxAngle = 45,
  radius = 3,
  easing = 'power3.out',
  duration = { enter: 0.3, leave: 0.6 },
  cellGap,
  borderStyle = '1px solid #fff',
  faceColor = '#120F17',
  shadow = false,
  autoAnimate = true
}) => {
  const sceneRef = useRef(null);
  const userActiveRef = useRef(false);
  const simPosRef = useRef({ x: 0, y: 0 });
  const simTargetRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const simRAFRef = useRef(null);

  const colGap =
    typeof cellGap === 'number'
      ? `${cellGap}px`
      : cellGap?.col !== undefined
      ? `${cellGap.col}px`
      : '5%';

  const rowGap =
    typeof cellGap === 'number'
      ? `${cellGap}px`
      : cellGap?.row !== undefined
      ? `${cellGap.row}px`
      : '5%';

  const enterDur = duration.enter;
  const leaveDur = duration.leave;

  const tiltAt = useCallback(
    (rowCenter, colCenter) => {
      if (!sceneRef.current) return;

      const time = performance.now() * 0.003; // Wave speed factor

      sceneRef.current.querySelectorAll('.cube').forEach(cube => {
        const r = +cube.dataset.row;
        const c = +cube.dataset.col;
        const dist = Math.hypot(r - rowCenter, c - colCenter);

        // Wave travels slightly further than tilt
        const waveRadius = radius * 1.8;
        const waveDecay = Math.max(0, 1 - dist / waveRadius);
        const tiltDecay = Math.max(0, 1 - dist / radius);

        // Dynamic sine wave math mapping (outward travel)
        const waveZ = Math.sin(dist * 1.8 - time * 8.0) * 45 * waveDecay;
        const angle = tiltDecay * maxAngle;

        gsap.to(cube, {
          duration: enterDur,
          ease: easing,
          overwrite: true,
          rotateX: -angle,
          rotateY: angle,
          z: waveZ,
          '--cube-border-color': `rgba(181, 155, 220, ${0.25 + waveDecay * 0.7})`
        });
      });
    },
    [radius, maxAngle, enterDur, easing]
  );

  const onPointerMove = useCallback(
    e => {
      userActiveRef.current = true;

      const rect = sceneRef.current.getBoundingClientRect();
      const cellW = rect.width / gridSize;
      const cellH = rect.height / gridSize;

      const colCenter = (e.clientX - rect.left) / cellW;
      const rowCenter = (e.clientY - rect.top) / cellH;

      mousePosRef.current = { x: colCenter, y: rowCenter };
    },
    [gridSize]
  );

  const resetAll = useCallback(() => {
    userActiveRef.current = false;

    if (!autoAnimate) {
      if (!sceneRef.current) return;
      sceneRef.current.querySelectorAll('.cube').forEach(cube =>
        gsap.to(cube, {
          duration: leaveDur,
          rotateX: 0,
          rotateY: 0,
          z: 0,
          ease: 'power3.out'
        })
      );
    }
  }, [leaveDur, autoAnimate]);

  useEffect(() => {
    if (!sceneRef.current) return;

    simPosRef.current = {
      x: gridSize / 2,
      y: gridSize / 2
    };

    simTargetRef.current = {
      x: Math.random() * gridSize,
      y: Math.random() * gridSize
    };

    const speed = 0.02;

    const loop = () => {
      const pos = simPosRef.current;

      if (userActiveRef.current) {
        // Follow mouse pointer smoothly
        pos.x += (mousePosRef.current.x - pos.x) * 0.15;
        pos.y += (mousePosRef.current.y - pos.y) * 0.15;
        tiltAt(pos.y, pos.x);
      } else if (autoAnimate) {
        // Run idle animation wave movement
        const tgt = simTargetRef.current;
        pos.x += (tgt.x - pos.x) * speed;
        pos.y += (tgt.y - pos.y) * speed;
        tiltAt(pos.y, pos.x);

        if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
          simTargetRef.current = {
            x: Math.random() * gridSize,
            y: Math.random() * gridSize
          };
        }
      }

      simRAFRef.current = requestAnimationFrame(loop);
    };

    simRAFRef.current = requestAnimationFrame(loop);

    return () => {
      if (simRAFRef.current != null) {
        cancelAnimationFrame(simRAFRef.current);
      }
    };
  }, [autoAnimate, gridSize, tiltAt]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', resetAll);

    return () => {
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', resetAll);
    };
  }, [onPointerMove, resetAll]);

  const cells = Array.from({ length: gridSize });

  const sceneStyle = {
    gridTemplateColumns: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    columnGap: colGap,
    rowGap: rowGap
  };

  const wrapperStyle = {
    '--cube-face-border': borderStyle,
    '--cube-face-bg': faceColor,
    '--cube-face-shadow':
      shadow === true
        ? '0 0 6px rgba(0,0,0,.5)'
        : shadow || 'none',
    ...(cubeSize
      ? {
          width: `${gridSize * cubeSize}px`,
          height: `${gridSize * cubeSize}px`
        }
      : {})
  };

  return (
    <div className="default-animation" style={wrapperStyle}>
      <div
        ref={sceneRef}
        className="default-animation--scene"
        style={sceneStyle}
      >
        {cells.map((_, r) =>
          cells.map((__, c) => (
            <div
              key={`${r}-${c}`}
              className="cube"
              data-row={r}
              data-col={c}
            >
              <div className="cube-inner">
                <div className="cube-face cube-face--top" />
                <div className="cube-face cube-face--bottom" />
                <div className="cube-face cube-face--left" />
                <div className="cube-face cube-face--right" />
                <div className="cube-face cube-face--front" />
                <div className="cube-face cube-face--back" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cubes;
