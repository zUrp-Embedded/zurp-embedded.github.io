---
Date: 2026-10-06
Dernière révision: 2026-11-24
Statut: actif — gabarit du README de l'organisation (zUrp-Embedded/.github → profile/README.md), régénéré à chaque déploiement
Référencé par: scripts/readme-kit.mjs
Marqueurs: voir content/README.md — {{x}} échappé pour le HTML, {{{x}}} tel quel ; {{> projects}} = le tableau de projects-table.md
Note: l'en-tête (image /profile/Low_tech_DIY.png du dépôt .github, trois badges) est écrit en clair, tel que le README de l'org le portait avant le moteur ; seule la liste des projets vient du catalogue.
---

<!-- zUrp-Embedded/.github → profile/README.md — {{{generated}}}. Copy the whole file. -->
<div align="center">

<img src="/profile/Low_tech_DIY.png" alt="zUrp Embedded logo — Nyan Cat, Low-Tech & DIY caption" width="320">

# {{{name}}}

*{{{tagline}}}*

![status](https://img.shields.io/badge/status-work_in_progress-orange)
![license](https://img.shields.io/badge/license-GPL--3.0-blue)
![tech](https://img.shields.io/badge/tech-1MB_of_bash-informational)

[**🌐 {{{siteHost}}}**]({{{siteUrl}}})

</div>

---

## 👋 Hi here

Welcome to DIY hell. {{{pitch}}}

## 🚀 Projects

### Work in Progress ⚠ NOT YET VALIDATED ⚠

{{#wipSections}}
#### {{{title}}}

{{> projects}}

{{/wipSections}}
{{#future}}
### {{{title}}} projects

{{> projects}}

{{/future}}
### Released ✅

{{#releasedSections}}
#### {{{title}}}

{{> projects}}

{{/releasedSections}}
{{^releasedSections}}
*Soon ©️*

{{/releasedSections}}
---

<div align="center">

*{{{signature}}}*

</div>
