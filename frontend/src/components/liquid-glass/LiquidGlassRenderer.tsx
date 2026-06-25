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

      uniform int u_pass;
      uniform vec2 u_resolution;
      uniform vec2 u_screen;
      uniform vec4 u_rect;
      uniform float u_radius;
      uniform float u_time;

      uniform float u_refraction;
      uniform float u_bevelDepth;
      uniform float u_bevelWidth;
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
          mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
          mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float metaball(vec2 p, vec2 c, float r) {
        float d = length(p - c);
        return (r * r) / max(d * d, 0.0008);
        }

        vec3 scene(vec2 uv) {
        vec2 p = uv;

        vec3 baseTop = vec3(0.018, 0.010, 0.022);
        vec3 baseBottom = vec3(0.110, 0.022, 0.070);
        vec3 col = mix(baseTop, baseBottom, p.y);

        vec2 c1 = vec2(0.14 + sin(u_time * 0.20) * 0.10, 0.18 + cos(u_time * 0.16) * 0.14);
        vec2 c2 = vec2(0.78 + sin(u_time * 0.15) * 0.12, 0.24 + cos(u_time * 0.19) * 0.12);
        vec2 c3 = vec2(0.30 + sin(u_time * 0.13) * 0.14, 0.82 + cos(u_time * 0.17) * 0.10);
        vec2 c4 = vec2(0.66 + sin(u_time * 0.18) * 0.10, 0.70 + cos(u_time * 0.14) * 0.12);
        vec2 c5 = vec2(0.48 + sin(u_time * 0.11) * 0.16, 0.48 + cos(u_time * 0.12) * 0.15);
        vec2 c6 = vec2(0.92 + sin(u_time * 0.10) * 0.08, 0.82 + cos(u_time * 0.13) * 0.10);

        float m1 = metaball(p, c1, 0.135);
        float m2 = metaball(p, c2, 0.155);
        float m3 = metaball(p, c3, 0.170);
        float m4 = metaball(p, c4, 0.125);
        float m5 = metaball(p, c5, 0.115);
        float m6 = metaball(p, c6, 0.135);

        float pink = smoothstep(0.82, 1.52, m1 + m2 + m5 * 0.7);
        float purple = smoothstep(0.76, 1.42, m3 + m5 * 0.85);
        float cream = smoothstep(0.72, 1.34, m4 + m6 * 0.7);

        float innerPink = smoothstep(1.4, 2.8, m1 + m2);
        float innerPurple = smoothstep(1.3, 2.4, m3 + m5);
        float innerCream = smoothstep(1.2, 2.2, m4 + m6);

        col = mix(col, vec3(1.00, 0.05, 0.35), pink * 0.92);
        col = mix(col, vec3(0.44, 0.15, 1.00), purple * 0.72);
        col = mix(col, vec3(1.00, 0.82, 0.62), cream * 0.58);

        col += vec3(1.0, 0.24, 0.56) * innerPink * 0.32;
        col += vec3(0.42, 0.18, 1.0) * innerPurple * 0.24;
        col += vec3(1.0, 0.92, 0.78) * innerCream * 0.20;

        float darkPocket = smoothstep(
            0.45,
            0.92,
            metaball(p, vec2(0.54 + sin(u_time * 0.08) * 0.10, 0.48 + cos(u_time * 0.09) * 0.10), 0.11)
        );

        col *= 1.0 - darkPocket * 0.58;

        float sweep = smoothstep(
            0.028,
            0.0,
            abs((p.x - p.y * 0.38) - (0.24 + sin(u_time * 0.10) * 0.18))
        );

        col += vec3(1.0) * sweep * 0.12;

        float vignette = smoothstep(0.95, 0.22, distance(p, vec2(0.5)));
        col *= mix(0.38, 1.12, vignette);

        float grain = noise(p * u_screen * 0.50 + u_time * 0.22);
        col += (grain - 0.5) * 0.045;

        return clamp(col, 0.0, 1.0);
        }

        float edgeFactor(vec2 uv, float radius_px) {
            vec2 p_px = (uv - 0.5) * u_resolution;
            vec2 b_px = 0.5 * u_resolution;
            float d = -udRoundBox(p_px, b_px, radius_px);
            float bevel_px = u_bevelWidth * min(u_resolution.x, u_resolution.y);

            return 1.0 - smoothstep(0.0, bevel_px, d);
            }

      vec4 glass(vec2 local) {
        vec2 p = local - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        float edge = edgeFactor(local, u_radius);

        float offsetAmt =
          edge * u_refraction +
          pow(edge, 10.0) * u_bevelDepth;

        float centreBlend = smoothstep(0.15, 0.45, length(p));
        vec2 offset = normalize(p + 0.0001) * offsetAmt * centreBlend;

        vec2 localUV = (local - 0.5) / u_magnify + 0.5;

        vec2 screenUV = vec2(
          (u_rect.x + localUV.x * u_rect.z) / u_screen.x,
          (u_rect.y + localUV.y * u_rect.w) / u_screen.y
        );

        vec3 baseCol = scene(screenUV);
        vec3 refrCol = scene(screenUV + offset);

        vec2 texel = vec2(1.0) / u_screen;

        refrCol += scene(screenUV + offset + vec2(texel.x, 0.0));
        refrCol += scene(screenUV + offset - vec2(texel.x, 0.0));
        refrCol += scene(screenUV + offset + vec2(0.0, texel.y));
        refrCol += scene(screenUV + offset - vec2(0.0, texel.y));
        refrCol /= 5.0;

        vec3 col = refrCol;

        vec3 redShift = scene(screenUV + offset * 1.18 + vec2(0.0035, 0.0));
        vec3 blueShift = scene(screenUV + offset * 0.82 - vec2(0.0035, 0.0));

        col.r = mix(col.r, redShift.r, edge * 0.65);
        col.b = mix(col.b, blueShift.b, edge * 0.65);

        float diff = clamp(length(refrCol - baseCol) * 4.0, 0.0, 1.0);
        float antiHalo = (1.0 - centreBlend) * diff;
        col = mix(col, baseCol, antiHalo * 0.38);

        if (u_specular) {
          vec2 lp1 = vec2(sin(u_time * 0.20), cos(u_time * 0.30)) * 0.6 + 0.5;
          vec2 lp2 = vec2(sin(u_time * -0.40 + 1.5), cos(u_time * 0.25 - 0.5)) * 0.6 + 0.5;

          float h = 0.0;
          h += smoothstep(0.42, 0.0, distance(local, lp1)) * 0.10;
          h += smoothstep(0.50, 0.0, distance(local, lp2)) * 0.08;

          col += h;
        }

        vec2 p_px = (local - 0.5) * u_resolution;
        vec2 b_px = 0.5 * u_resolution;
        float dmask = udRoundBox(p_px, b_px, u_radius);
        float inShape = 1.0 - smoothstep(-1.0, 1.0, dmask);

        float fresnel = pow(edge, 2.35);
        col += vec3(1.0) * fresnel * 0.18;

        float topRim = smoothstep(0.20, 0.0, local.y);
        float bottomRim = smoothstep(0.72, 1.0, local.y);
        col += vec3(1.0) * topRim * edge * 0.16;
        col *= 1.0 - bottomRim * edge * 0.12;

        float alpha = inShape * (0.18 + edge * 0.58);

        return vec4(col, alpha);
      }

      void main() {
        if (u_pass == 0) {
          vec3 col = scene(v_uv);
          gl_FragColor = vec4(col, 1.0);
          return;
        }

        gl_FragColor = glass(v_uv);
      }
    `;

    function createShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader.");

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

    const uPass = gl.getUniformLocation(program, "u_pass");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uScreen = gl.getUniformLocation(program, "u_screen");
    const uRect = gl.getUniformLocation(program, "u_rect");
    const uRadius = gl.getUniformLocation(program, "u_radius");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRefraction = gl.getUniformLocation(program, "u_refraction");
    const uBevelDepth = gl.getUniformLocation(program, "u_bevelDepth");
    const uBevelWidth = gl.getUniformLocation(program, "u_bevelWidth");
    const uMagnify = gl.getUniformLocation(program, "u_magnify");
    const uSpecular = gl.getUniformLocation(program, "u_specular");

    if (
      !uPass ||
      !uResolution ||
      !uScreen ||
      !uRect ||
      !uRadius ||
      !uTime ||
      !uRefraction ||
      !uBevelDepth ||
      !uBevelWidth ||
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

    function bindCommon(timeMs: number) {
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uScreen, window.innerWidth, window.innerHeight);
      gl.uniform1f(uTime, timeMs / 1000);

      gl.uniform1f(uRefraction, 0.026);
      gl.uniform1f(uBevelDepth, 0.119);
      gl.uniform1f(uBevelWidth, 0.057);
      gl.uniform1f(uMagnify, 1.0);
      gl.uniform1i(uSpecular, 1);
    }

    function render(timeMs: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      gl.disable(gl.SCISSOR_TEST);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      bindCommon(timeMs);

      gl.disable(gl.BLEND);
      gl.uniform1i(uPass, 0);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform4f(uRect, 0, 0, window.innerWidth, window.innerHeight);
      gl.uniform1f(uRadius, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.uniform1i(uPass, 1);

      for (const lens of lenses.values()) {
        const rect = lens.element.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) continue;

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