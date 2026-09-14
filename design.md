# Design — Growth Archive × Nomadic Tribe

## 1. Concept
个人技术成长档案：像 2019.makemepulse《Nomadic Tribe》一样，用**全屏 WebGL 叙事**承载作品集，而不是卡片墙。

## 2. Inspiration DNA (from live site walkthrough)
- **3D 主视觉**：水面漂浮的半透明晶体群（大 1 + 小 2），粉彩天空、云、涟漪
- **纸感 UI**：奶油纸纹底 / 灰蓝纸纹章节；Gotham 大写宽字距
- **2D 饰框**：Art Nouveau 双线角框、三段按钮、竖线 loader
- **运镜**：极慢 orbit / dolly；自定义光标；章节叙事推进
- **内容**：故事感章节，不是「PPT 九宫格」

## 3. Tone sentence
> Cinematic painterly 3D × Editorial paper UI：粉彩天空里的晶体叙事 + 奶油纸/Gotham 编辑排版。

## 4. Palette
| Role | Hex |
|------|-----|
| Paper cream | `#f3eee3` |
| Dusty blue paper | `#6b7288` |
| Ink slate | `#3d4a68` / `#5b6a8a` |
| Blush sky | `#e8c8c4` / `#d4b0ac` |
| Crystal ice | `#a8c4d8` / `#cfe0ee` |
| Sage foliage hint | `#7fa392` |

## 5. Typography
- Display: Montserrat (Gotham proxy), 700, uppercase, tracking 0.2–0.3em
- UI base 12px；主标题 clamp 32–56px
- 中文：系统黑体，字距略松

## 6. Sections (scroll narrative)
1. **Loader** — dusty blue paper + vertical line
2. **Hero** — full-viewport WebGL crystals + name/title + Enter CTA
3. **Chapter Works** — camera dolly closer; project list as story cards on paper strip
4. **Chapter Skills / Timeline** — crystals drift; skills as floating plates
5. **Chapter Notes / Resume** — pull-back wide shot; CTA to resume/admin

## 7. Interaction
- Scroll → camera path + fog color + crystal rotation
- Mouse parallax on camera
- Custom cursor (dot + lag ring + trail)
- Hover project cards: lift + line draw
- Enter button: 3-part expand

## 8. Tech
- Next.js + React Three Fiber + Drei
- Custom crystal geometry (octahedron/prism cluster)
- Soft gradient sky + fog; paper noise overlay
- No external CDN at runtime (npm bundled)

## 9. Priority
Must: true 3D hero crystals + scroll camera + paper editorial overlay + working portfolio routes
Bonus: water ripple shader, audio hint, chapter transitions
