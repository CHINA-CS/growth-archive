import type { Config } from "tailwindcss";

/**
 * 2019.makemepulse Nomadic Tribe 色板：
 * 奶油纸底 + 灰蓝线稿 + 粉彩点缀（非深色金边）
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#f3eee3",
          warm: "#ebe4d4",
          deep: "#e0d6c4",
          card: "#f7f2e8",
        },
        slateink: {
          DEFAULT: "#5b6a8a",
          deep: "#3d4a68",
          soft: "#7d8aa3",
          mute: "#9aa3b5",
        },
        blush: {
          DEFAULT: "#e4b8b4",
          soft: "#f0d4d0",
          deep: "#c99690",
        },
        sage: {
          DEFAULT: "#7fa392",
          soft: "#a8c4b4",
          deep: "#5d8272",
        },
        sky: {
          DEFAULT: "#a8c0d4",
          soft: "#c5d6e4",
          deep: "#7a9ab4",
        },
        cream: {
          DEFAULT: "#f8f4ea",
        },
      },
      fontFamily: {
        display: [
          "var(--font-montserrat)",
          "Gotham",
          "Montserrat",
          "Futura",
          "Avenir Next",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-montserrat)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: ["ui-monospace", "Consolas", "Menlo", "monospace"],
      },
      letterSpacing: {
        wide2: "0.18em",
        wide3: "0.28em",
        wide4: "0.36em",
      },
      boxShadow: {
        plate: "0 1px 0 rgba(91,106,138,0.08), 0 12px 28px rgba(61,74,104,0.10)",
        plateHover: "0 2px 0 rgba(91,106,138,0.10), 0 18px 36px rgba(61,74,104,0.14)",
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        riseIn: "riseIn 0.75s cubic-bezier(0.215,0.61,0.355,1) both",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3.5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        pulse: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
