/** Phát âm tiếng Trung (giọng hệ thống, zh-CN) */

export function speakChinese(text: string, rate = 0.88): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  window.speechSynthesis?.cancel();
}
