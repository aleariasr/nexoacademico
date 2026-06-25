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

      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 0.5;

        for (int i = 0; i < 5; i++) {
          value += noise(p) * amp;
          p *= 2.02;
          amp *= 0.48;
        }

        return value;
      }

      float metaball(vec2 p, vec2 c, float r) {
        vec2 d = p - c;
        return (r * r) / max(dot(d, d), 0.0007);
      }

      float softMass(float field, float low, float high) {
        return smoothstep(low, high, field);
      }

      vec3 scene(vec2 uv) {
        vec2 p = uv;

        float aspect = u_screen.x / u_screen.y;
        vec2 q = vec2((p.x - 0.5) * aspect + 0.5, p.y);

        vec3 col = mix(
          vec3(0.010, 0.009, 0.018),
          vec3(0.075, 0.022, 0.052),
          p.y
        );

        float t = u_time * 0.42;

        vec2 a1 = vec2(0.14 + sin(t * 0.45) * 0.10, 0.22 + cos(t * 0.52) * 0.13);
        vec2 a2 = vec2(0.82 + sin(t * 0.38 + 1.7) * 0.11, 0.20 + cos(t * 0.47) * 0.10);
        vec2 a3 = vec2(0.32 + sin(t * 0.34 + 2.1) * 0.15, 0.84 + cos(t * 0.40) * 0.10);
        vec2 a4 = vec2(0.68 + sin(t * 0.42 + 4.4) * 0.13, 0.76 + cos(t * 0.36) * 0.12);
        vec2 a5 = vec2(0.50 + sin(t * 0.30 + 0.9) * 0.17, 0.50 + cos(t * 0.33) * 0.15);
        vec2 a6 = vec2(0.95 + sin(t * 0.28 + 2.8) * 0.10, 0.56 + cos(t * 0.35) * 0.18);
        vec2 a7 = vec2(0.03 + sin(t * 0.31 + 5.0) * 0.12, 0.64 + cos(t * 0.41) * 0.14);

        float pinkField =
          metaball(p, a1, 0.20) +
          metaball(p, a2, 0.22) +
          metaball(p, a6, 0.16);

        float purpleField =
          metaball(p, a3, 0.22) +
          metaball(p, a5, 0.18);

        float warmField =
          metaball(p, a4, 0.18) +
          metaball(p, vec2(0.54 + sin(t * 0.26) * 0.08, 0.12 + cos(t * 0.30) * 0.08), 0.17);

        float edgeNoise = fbm(p * 3.0 + vec2(t * 0.12, -t * 0.10));

        float pink = softMass(pinkField + edgeNoise * 0.16, 0.58, 1.20);
        float purple = softMass(purpleField + edgeNoise * 0.14, 0.56, 1.12);
        float warm = softMass(warmField + edgeNoise * 0.12, 0.54, 1.05);

        vec3 pinkCol = vec3(1.00, 0.06, 0.34);
        vec3 purpleCol = vec3(0.42, 0.16, 1.00);
        vec3 warmCol = vec3(1.00, 0.78, 0.58);

        col = mix(col, pinkCol, pink * 0.88);
        col = mix(col, purpleCol, purple * 0.74);
        col = mix(col, warmCol, warm * 0.58);

        float whiteGlow =
          softMass(
            metaball(p, vec2(0.44 + sin(t * 0.22) * 0.08, 0.19 + cos(t * 0.25) * 0.06), 0.15),
            0.50,
            1.18
          );

        col += vec3(1.0, 0.90, 0.92) * whiteGlow * 0.48;

        float darkPocket =
          softMass(
            metaball(p, vec2(0.56 + sin(t * 0.20) * 0.12, 0.50 + cos(t * 0.21) * 0.10), 0.14),
            0.46,
            1.10
          );

        col *= 1.0 - darkPocket * 0.55;

        float horizontalGlow =
          smoothstep(0.65, 0.48, abs(p.y - (0.62 + sin(t * 0.24) * 0.05))) *
          smoothstep(0.0, 0.35, p.x) *
          smoothstep(1.0, 0.60, p.x);

        col += vec3(0.42, 0.58, 1.00) * horizontalGlow * 0.16;

        float liquidShade = fbm(p * 6.0 + vec2(-t * 0.18, t * 0.14));
        col *= 0.88 + liquidShade * 0.20;

        float vignette = smoothstep(0.95, 0.28, distance(p, vec2(0.5)));
        col *= mix(0.34, 1.10, vignette);

        float grain = noise(p * u_screen * 0.42 + u_time * 0.18);
        col += (grain - 0.5) * 0.030;

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

        vec3 redShift = scene(screenUV + offset * 1.16 + vec2(0.0028, 0.0));
        vec3 blueShift = scene(screenUV + offset * 0.84 - vec2(0.0028, 0.0));

        col.r = mix(col.r, redShift.r, edge * 0.56);
        col.b = mix(col.b, blueShift.b, edge * 0.56);

        float diff = clamp(length(refrCol - baseCol) * 4.0, 0.0, 1.0);
        float antiHalo = (1.0 - centreBlend) * diff;
        col = mix(col, baseCol, antiHalo * 0.34);

        if (u_specular) {
          vec2 lp1 = vec2(sin(u_time * 0.18), cos(u_time * 0.24)) * 0.58 + 0.5;
          vec2 lp2 = vec2(sin(u_time * -0.32 + 1.5), cos(u_time * 0.20 - 0.5)) * 0.58 + 0.5;

          float h = 0.0;
          h += smoothstep(0.40, 0.0, distance(local, lp1)) * 0.08;
          h += smoothstep(0.52, 0.0, distance(local, lp2)) * 0.06;

          col += h;
        }

        vec2 p_px = (local - 0.5) * u_resolution;
        vec2 b_px = 0.5 * u_resolution;
        float dmask = udRoundBox(p_px, b_px, u_radius);
        float inShape = 1.0 - smoothstep(-1.0, 1.0, dmask);

        float fresnel = pow(edge, 2.15);
        col += vec3(1.0) * fresnel * 0.15;

        float topRim = smoothstep(0.20, 0.0, local.y);
        float bottomRim = smoothstep(0.72, 1.0, local.y);

        col += vec3(1.0) * topRim * edge * 0.14;
        col *= 1.0 - bottomRim * edge * 0.10;

        float alpha = inShape * (0.20 + edge * 0.54);

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