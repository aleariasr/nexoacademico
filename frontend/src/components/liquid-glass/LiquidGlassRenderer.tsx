"use client";

import { useEffect, useRef } from "react";

type Lens = {
  id: string;
  element: HTMLElement;
  radius: number;
};

const lenses = new Map<string, Lens>();

export function registerLiquidLens(lens: Lens): () => void {
  lenses.set(lens.id, lens);

  return () => {
    lenses.delete(lens.id);
  };
}

export default function LiquidGlassRenderer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const glContext = canvasElement.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
    });

    if (!glContext) return;

    const canvas = canvasElement;
    const gl = glContext;

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;

      varying vec2 v_uv;

      uniform vec2 u_resolution;
      uniform vec2 u_screen;
      uniform vec4 u_rect;
      uniform float u_radius;
      uniform float u_time;

      uniform float u_refraction;
      uniform float u_bevelDepth;
      uniform float u_bevelWidth;
      uniform float u_frost;
      uniform float u_magnify;
      uniform bool u_specular;

      float udRoundBox(vec2 p, vec2 b, float r) {
        return length(max(abs(p) - b + r, 0.0)) - r;
      }

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
          mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float edgeFactor(vec2 uv, float radius_px) {
        vec2 p_px = (uv - 0.5) * u_resolution;
        vec2 b_px = 0.5 * u_resolution;
        float d = -udRoundBox(p_px, b_px, radius_px);
        float bevel_px = u_bevelWidth * min(u_resolution.x, u_resolution.y);
        return 1.0 - smoothstep(0.0, bevel_px, d);
      }

      vec3 scene(vec2 uv) {
        vec2 p = uv;

        vec3 base = mix(
          vec3(0.015, 0.014, 0.024),
          vec3(0.09, 0.026, 0.065),
          p.y
        );

        float b1 = smoothstep(0.72, 0.0, distance(p, vec2(0.12 + sin(u_time * 0.08) * 0.12, 0.20 + cos(u_time * 0.07) * 0.10)));
        float b2 = smoothstep(0.78, 0.0, distance(p, vec2(0.88 + sin(u_time * 0.06) * 0.10, 0.24 + cos(u_time * 0.09) * 0.12)));
        float b3 = smoothstep(0.76, 0.0, distance(p, vec2(0.42 + sin(u_time * 0.05) * 0.14, 0.88 + cos(u_time * 0.06) * 0.10)));
        float b4 = smoothstep(0.60, 0.0, distance(p, vec2(0.70 + sin(u_time * 0.11) * 0.08, 0.70 + cos(u_time * 0.08) * 0.08)));

        base += vec3(1.0, 0.10, 0.42) * b1 * 0.86;
        base += vec3(1.0, 0.32, 0.62) * b2 * 0.62;
        base += vec3(0.36, 0.14, 1.0) * b3 * 0.58;
        base += vec3(1.0, 0.86, 0.72) * b4 * 0.22;

        float sheen = smoothstep(
          0.035,
          0.0,
          abs((p.x - p.y * 0.38) - (0.22 + sin(u_time * 0.08) * 0.12))
        );

        base += vec3(1.0) * sheen * 0.10;

        float grain = noise(p * u_screen * 0.45 + u_time * 0.45);
        base += (grain - 0.5) * 0.026;

        return base;
      }

      void main() {
        vec2 p = v_uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        float edge = edgeFactor(v_uv, u_radius);

        float offsetAmt =
          edge * u_refraction +
          pow(edge, 10.0) * u_bevelDepth;

        float centreBlend = smoothstep(0.15, 0.45, length(p));

        vec2 offset = normalize(p + 0.0001) * offsetAmt * centreBlend;

        vec2 localUV = (v_uv - 0.5) / u_magnify + 0.5;

        vec2 screenUV = vec2(
          (u_rect.x + localUV.x * u_rect.z) / u_screen.x,
          (u_rect.y + localUV.y * u_rect.w) / u_screen.y
        );

        screenUV.y = 1.0 - screenUV.y;

        vec3 baseCol = scene(screenUV);
        vec3 refrCol = scene(screenUV + offset);

        vec2 texel = vec2(1.0) / u_screen;

        refrCol += scene(screenUV + offset + vec2(texel.x, 0.0));
        refrCol += scene(screenUV + offset - vec2(texel.x, 0.0));
        refrCol += scene(screenUV + offset + vec2(0.0, texel.y));
        refrCol += scene(screenUV + offset - vec2(0.0, texel.y));
        refrCol /= 5.0;

        vec3 col = refrCol;

        vec3 redShift = scene(screenUV + offset * 1.18 + vec2(0.003, 0.0));
        vec3 blueShift = scene(screenUV + offset * 0.82 - vec2(0.003, 0.0));

        col.r = mix(col.r, redShift.r, edge * 0.55);
        col.b = mix(col.b, blueShift.b, edge * 0.55);

        float diff = clamp(length(refrCol - baseCol) * 4.0, 0.0, 1.0);
        float antiHalo = (1.0 - centreBlend) * diff;
        col = mix(col, baseCol, antiHalo * 0.42);

        if (u_specular) {
          vec2 lp1 = vec2(sin(u_time * 0.2), cos(u_time * 0.3)) * 0.6 + 0.5;
          vec2 lp2 = vec2(sin(u_time * -0.4 + 1.5), cos(u_time * 0.25 - 0.5)) * 0.6 + 0.5;

          float h = 0.0;
          h += smoothstep(0.4, 0.0, distance(v_uv, lp1)) * 0.10;
          h += smoothstep(0.5, 0.0, distance(v_uv, lp2)) * 0.08;

          col += h;
        }

        vec2 p_px = (v_uv - 0.5) * u_resolution;
        vec2 b_px = 0.5 * u_resolution;
        float dmask = udRoundBox(p_px, b_px, u_radius);
        float inShape = 1.0 - smoothstep(-1.0, 1.0, dmask);

        float fresnel = pow(edge, 2.35);
        col += vec3(1.0) * fresnel * 0.16;

        float alpha = inShape * (0.34 + edge * 0.40);

        gl_FragColor = vec4(col, alpha);
      }
    `;

    function createShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type);

      if (!shader) {
        throw new Error("Could not create shader.");
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(info || "Shader compilation failed.");
      }

      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const buffer = gl.createBuffer();
    if (!buffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "a_position");

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uScreen = gl.getUniformLocation(program, "u_screen");
    const uRect = gl.getUniformLocation(program, "u_rect");
    const uRadius = gl.getUniformLocation(program, "u_radius");
    const uTime = gl.getUniformLocation(program, "u_time");

    const uRefraction = gl.getUniformLocation(program, "u_refraction");
    const uBevelDepth = gl.getUniformLocation(program, "u_bevelDepth");
    const uBevelWidth = gl.getUniformLocation(program, "u_bevelWidth");
    const uFrost = gl.getUniformLocation(program, "u_frost");
    const uMagnify = gl.getUniformLocation(program, "u_magnify");
    const uSpecular = gl.getUniformLocation(program, "u_specular");

    if (
      !uResolution ||
      !uScreen ||
      !uRect ||
      !uRadius ||
      !uTime ||
      !uRefraction ||
      !uBevelDepth ||
      !uBevelWidth ||
      !uFrost ||
      !uMagnify ||
      !uSpecular
    ) {
      return;
    }

    let raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }

    function render(timeMs: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uScreen, window.innerWidth, window.innerHeight);
      gl.uniform1f(uTime, timeMs / 1000);

      gl.uniform1f(uRefraction, 0.026);
      gl.uniform1f(uBevelDepth, 0.119);
      gl.uniform1f(uBevelWidth, 0.057);
      gl.uniform1f(uFrost, 0.0);
      gl.uniform1f(uMagnify, 1.0);
      gl.uniform1i(uSpecular, 1);

      for (const lens of lenses.values()) {
        const rect = lens.element.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) continue;
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        if (rect.right < 0 || rect.left > window.innerWidth) continue;

        const x = rect.left * dpr;
        const y = canvas.height - (rect.top + rect.height) * dpr;
        const w = rect.width * dpr;
        const h = rect.height * dpr;

        gl.viewport(x, y, w, h);

        gl.uniform2f(uResolution, w, h);
        gl.uniform4f(uRect, rect.left, rect.top, rect.width, rect.height);
        gl.uniform1f(uRadius, lens.radius * dpr);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      raf = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);

      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="liquid-glass-renderer" />;
}