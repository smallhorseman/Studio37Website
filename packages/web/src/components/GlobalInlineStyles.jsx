import React from 'react';

const GLOBAL_UTILITY_CSS = `
.header{height:5rem;display:flex;align-items:center;justify-content:space-between;padding-left:1rem;padding-right:1rem;background:#FFFDF6;}
.logo{height:3rem;width:auto;font-family:'Gochi Hand',cursive;}
.page{max-width:72rem;margin-left:auto;margin-right:auto;padding:3rem 1rem;}
.page-narrow{max-width:48rem;margin-left:auto;margin-right:auto;padding:3rem 1rem;}
.page-header{margin-bottom:2rem;}
.page-title{font-size:1.875rem;line-height:2.25rem;font-family:Georgia,serif;letter-spacing:-.01em;font-weight:600;color:#36454F;}
@media (min-width:640px){.page-title{font-size:2.25rem;line-height:2.5rem;}}
.page-subtitle{margin-top:.5rem;font-size:1.125rem;line-height:1.75rem;color:#4b5563;}
.section{margin-top:3rem;}
.card-grid{display:grid;gap:2rem;}
@media (min-width:640px){.card-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media (min-width:1024px){.card-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}
.card{border:1px solid #e5e7eb;background:#ffffff;border-radius:0.75rem;padding:1.5rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.04);transition:box-shadow .18s ease;}
.card:hover{box-shadow:0 4px 14px -2px rgba(0,0,0,.08);}
.card-title{font-size:1.125rem;line-height:1.75rem;font-weight:600;color:#36454F;margin:0 0 .25rem;}
.muted{font-size:.875rem;line-height:1.25rem;color:#6b7280;}
.link-inline{color:#468289;text-decoration:none;}
.link-inline:hover{text-decoration:underline;}
.badge{display:inline-block;background:rgba(70,130,137,.10);color:#468289;border-radius:.375rem;padding:.125rem .5rem;font-size:.75rem;font-weight:500;}
.loading-block,.error-block,.empty-block{text-align:center;}
.loading-block{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
.btn{display:inline-flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:500;padding:.5rem 1rem;border-radius:.375rem;line-height:1.25rem;transition:background .18s, color .18s, border-color .18s;}
.btn-primary{background:#468289;color:#fff;}
.btn-primary:hover{background:#36454F;}
.btn-outline{background:#ffffff;color:#468289;border:1px solid #468289;}
.btn-outline:hover{background:rgba(70,130,137,.06);}
.btn-danger{background:#dc2626;color:#fff;}
.btn-danger:hover{background:#b91c1c;}
.stack-sm> * + *{margin-top:.5rem;}
.stack-md> * + *{margin-top:1rem;}
.stack-lg> * + *{margin-top:1.5rem;}
.dark .card{background:rgba(54,69,79,.60);border-color:#36454F;color:#FFFDF6;}
.dark .page-title{color:#FFFDF6;}
.skeleton{border-radius:.375rem;background:#e5e7eb;animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;}
.dark .skeleton{background:rgba(54,69,79,.4);}
.skeleton-line{height:1rem;width:100%;}
.skeleton-sm{height:.75rem;width:66%;}
.skeleton-card{border:1px solid #e5e7eb;border-radius:.5rem;padding:1rem;}
@media print {
  .header, nav, footer {display:none !important;}
  .page,.page-narrow{max-width:none;padding:1rem 0;}
  body{background:#fff !important;}
}
`;

export default function GlobalInlineStyles() {
  return <style data-inline-utilities>{GLOBAL_UTILITY_CSS}</style>;
}
