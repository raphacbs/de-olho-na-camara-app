
import React from 'react';
import { SDUIScreen } from '@/types/sdui';
import { ScreenRenderer } from '@/sdui/ScreenRenderer';

const mockScreen: SDUIScreen = {
  "id": "home",
  "title": "De Olho na Câmara",
  "components": [
    // Header com gradiente brasileiro (FIXO)
    {
      "id": "header-container",
      "type": "Container",
      "direction": "column",
      "padding": 0,
      "sticky": true,
      "style": {
        "backgroundColor": "#009C3B",
        "paddingTop": 20,
        "paddingBottom": 30,
        "borderBottomLeftRadius": 20,
        "borderBottomRightRadius": 20
      },
      "children": [
        {
          "id": "welcome-text",
          "type": "TextBlock",
          "text": "🇧🇷 Bem-vindo ao",
          "variant": "body",
          "color": "#FFFFFF",
          "textAlign": "center",
          "style": { "marginBottom": 8 }
        },
        {
          "id": "title-main",
          "type": "TextBlock",
          "text": "De Olho na Câmara",
          "variant": "display",
          "color": "#FFFFFF",
          "fontSize": 28,
          "fontWeight": "700",
          "textAlign": "center",
          "letterSpacing": -0.5,
          "style": { "marginBottom": 8 }
        },
        {
          "id": "subtitle-main",
          "type": "TextBlock",
          "text": "Acompanhe em tempo real as atividades legislativas",
          "variant": "body",
          "color": "#E8F5E8",
          "textAlign": "center",
          "fontSize": 14
        }
      ]
    },

    // Espaçamento
    {
      "id": "spacer-header",
      "type": "Spacer",
      "size": "large"
    },

    // Seção de Últimas Proposições
    {
      "id": "propositions-section",
      "type": "Container",
      "direction": "column",
      "spacing": 20,
      "padding": "0 20",
      "children": [
        {
          "id": "propositions-header",
          "type": "Container",
          "direction": "row",
          "justifyContent": "space-between",
          "alignItems": "center",
          "children": [
            {
              "id": "propositions-title",
              "type": "TextBlock",
              "text": "Últimas Proposições",
              "variant": "headline",
              "color": "#1a1a1a",
              "fontSize": 20,
              "fontWeight": "600"
            },
            {
              "id": "view-all-btn",
              "type": "Button",
              "title": "Ver todas",
              "variant": "ghost",
              "size": "small",
              "onPress": "navigate_propositions"
            }
          ]
        },

        // Cards de proposições
        {
          "id": "proposition-1",
          "type": "Card",
          "title": "RIC 7828/2025",
          "subtitle": "Requerimento de Informação",
          "elevation": 1,
          "borderRadius": 12,
          "padding": 16,
          "margin": "0 0 8 0",
          "backgroundColor": "#FFFFFF",
          "onPress": "open_proposition_7828",
          "children": [
            {
              "id": "prop-1-text",
              "type": "TextBlock",
              "text": "Sobre apoio do BNDES a projetos brasileiros em Moçambique",
              "variant": "body",
              "color": "#666",
              "fontSize": 14,
              "lineHeight": 20
            }
          ]
        },
        {
          "id": "spacer-header-1",
          "type": "Spacer",
          "size": "medium"
        },

        {
          "id": "proposition-2",
          "type": "Card",
          "title": "PL 5946/2025",
          "subtitle": "Projeto de Lei",
          "elevation": 1,
          "borderRadius": 12,
          "padding": 16,
          "margin": "0 0 8 0",
          "backgroundColor": "#FFFFFF",
          "onPress": "open_proposition_5946",
          "children": [
            {
              "id": "prop-2-text",
              "type": "TextBlock",
              "text": "Isenção de impostos para equipamentos de combate a incêndios",
              "variant": "body",
              "color": "#666",
              "fontSize": 14,
              "lineHeight": 20
            }
          ]
        },
        {
          "id": "spacer-header-2",
          "type": "Spacer",
          "size": "medium"
        },

        {
          "id": "proposition-3",
          "type": "Card",
          "title": "PL 5945/2025",
          "subtitle": "Projeto de Lei",
          "elevation": 1,
          "borderRadius": 12,
          "padding": 16,
          "margin": "0 0 8 0",
          "backgroundColor": "#FFFFFF",
          "onPress": "open_proposition_5945",
          "children": [
            {
              "id": "prop-3-text",
              "type": "TextBlock",
              "text": "Preservação de proventos para militares estaduais",
              "variant": "body",
              "color": "#666",
              "fontSize": 14,
              "lineHeight": 20
            }
          ]
        }
      ]
    },

    // Espaçamento
    {
      "id": "spacer-propositions",
      "type": "Spacer",
      "size": "xlarge"
    },

    // Seção de Estatísticas
    {
      "id": "stats-section",
      "type": "Container",
      "direction": "column",
      "spacing": 16,
      "padding": "0 20",
      "children": [
        {
          "id": "stats-title",
          "type": "TextBlock",
          "text": "📊 Estatísticas da Semana",
          "variant": "headline",
          "color": "#1a1a1a",
          "fontSize": 20,
          "fontWeight": "600",
          "style": { "marginBottom": 8 }
        },

        // Grid de estatísticas
        {
          "id": "stats-grid",
          "type": "Container",
          "direction": "row",
          "spacing": 16,
          "wrap": true,
          "children": [
            {
              "id": "stat-1",
              "type": "Card",
              "elevation": 1,
              "borderRadius": 12,
              "padding": 16,
              "margin": "0 0 8 0",
              "backgroundColor": "#FFF3CD",
              "style": { "flex": 1, "minWidth": 140 },
              "children": [
                {
                  "id": "stat-1-number",
                  "type": "TextBlock",
                  "text": "5",
                  "variant": "display",
                  "color": "#0000",
                  "fontSize": 32,
                  "fontWeight": "700",
                  "textAlign": "center"
                },
                {
                  "id": "stat-1-label",
                  "type": "TextBlock",
                  "text": "Novas Proposições",
                  "variant": "caption",
                  "color": "#856404",
                  "textAlign": "center",
                  "fontSize": 12,
                  "fontWeight": "500"
                }
              ]
            },
            {
              "id": "spacer-header-3",
              "type": "Spacer",
              "size": "medium"
            },
            {
              "id": "stat-2",
              "type": "Card",
              "elevation": 1,
              "borderRadius": 12,
              "padding": 16,
              "margin": "0 0 8 0",
              "backgroundColor": "#D1ECF1",
              "style": { "flex": 1, "minWidth": 140 },
              "children": [
                {
                  "id": "stat-2-number",
                  "type": "TextBlock",
                  "text": "15",
                  "variant": "display",
                  "color": "#0C5460",
                  "fontSize": 32,
                  "fontWeight": "700",
                  "textAlign": "center"
                },
                {
                  "id": "stat-2-label",
                  "type": "TextBlock",
                  "text": "Em Tramitação",
                  "variant": "caption",
                  "color": "#0C5460",
                  "textAlign": "center",
                  "fontSize": 12,
                  "fontWeight": "500"
                }
              ]
            },
            {
              "id": "spacer-header-4",
              "type": "Spacer",
              "size": "medium"
            },
            {
              "id": "stat-3",
              "type": "Card",
              "elevation": 1,
              "borderRadius": 12,
              "padding": 16,
              "margin": "0 0 8 0",
              "backgroundColor": "#D4EDDA",
              "style": { "flex": 1, "minWidth": 140 },
              "children": [
                {
                  "id": "stat-3-number",
                  "type": "TextBlock",
                  "text": "8",
                  "variant": "display",
                  "color": "#155724",
                  "fontSize": 32,
                  "fontWeight": "700",
                  "textAlign": "center"
                },
                {
                  "id": "stat-3-label",
                  "type": "TextBlock",
                  "text": "Votações Realizadas",
                  "variant": "caption",
                  "color": "#155724",
                  "textAlign": "center",
                  "fontSize": 12,
                  "fontWeight": "500"
                }
              ]
            }
          ]
        }
      ]
    },

    // Espaçamento final
    {
      "id": "spacer-bottom",
      "type": "Spacer",
      "size": "large"
    },
  ]
};

export function HomeScreen() {
  return <ScreenRenderer screen={mockScreen} />;
}
