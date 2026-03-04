const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, PageNumber, HeadingLevel, PageBreak, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat } = require('docx');
const fs = require('fs');

const colors = {
  primary: "020617",
  body: "1E293B",
  secondary: "64748B",
  accent: "94A3B8",
  tableBg: "F8FAFC"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: colors.secondary };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 72, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 600, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
      { id: "Quote", name: "Quote", basedOn: "Normal",
        run: { size: 22, italics: true, color: colors.accent, font: "Times New Roman" },
        paragraph: { spacing: { before: 150, after: 150 }, indent: { left: 720, right: 720 } } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "ELEVATOR.EXE \u2014 BRANCHING CONSEQUENCE MAP", font: "Times New Roman", size: 18, color: colors.secondary })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "ARCHIVE PATH MAP \u2014 PAGE ", font: "Times New Roman", size: 18, color: colors.secondary }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 18, color: colors.secondary }),
          new TextRun({ text: " OF ", font: "Times New Roman", size: 18, color: colors.secondary }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Times New Roman", size: 18, color: colors.secondary })
        ]
      })] })
    },
    children: [
      // TITLE PAGE
      new Paragraph({ spacing: { before: 2400 }, children: [] }),
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("ELEVATOR.EXE")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 400 },
        children: [new TextRun({ text: "FRACTURED LOOP", size: 48, color: colors.secondary, font: "Times New Roman" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", color: colors.accent, size: 20 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: "BRANCHING CONSEQUENCE MAP", size: 36, bold: true, color: colors.body, font: "Times New Roman" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
        children: [new TextRun({ text: "Complete Endings, Trigger Conditions & Narrative Paths", size: 24, color: colors.secondary, font: "Times New Roman" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 },
        children: [new TextRun({ text: "CLASSIFICATION: OUTCOME PROBABILITY MATRIX", size: 20, color: colors.accent, font: "Times New Roman" })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 1: ENDING TAXONOMY
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION I: ENDING TAXONOMY")] }),
      
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The simulation concludes in one of five primary outcome categories. Each category represents a fundamentally different resolution to the archive's core conflict\u2014the question of whether the subjects can integrate suppressed truth without catastrophic destabilization. The endings are categorized by their stability requirements, character state prerequisites, and narrative tone rather than by conventional notions of 'good' or 'bad' outcomes. Every ending represents a valid resolution to the psychological tension the system creates.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 INTEGRATION ENDINGS")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Integration endings occur when all three subjects successfully access and process the suppressed memory. The subject achieves some form of emotional reconciliation with the truth\u2014not necessarily forgiveness, but acceptance that responsibility. These endings require careful management of the investigation phase, building sufficient trust with all subjects to lower their suppression indices below critical Threshold (30 for most subjects), while maintaining overall system stability above the Collapse Threshold (25).", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Full Integration (The Release)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "All three subjects achieve emotional integration. The suppression Index drops below 20 for all characters. The overall Stability never falls below 60 during the investigation phase. Trust toward Player exceeds 70 for all subjects. The system successfully completes Archive processing and releases all subjects from the simulation.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- Viktor: Suppression Index < 15, Trust > 75, Stability > 50\n- Livia: Suppression Index < 20, Trust > 70, Stability > 45\n- Mara: Suppression Index < 25, Trust > 80, Stability > 40\n- Overall System Stability > 55\n- Memory Fragment 'name-revelation-final' accessed\n- All three characters in CALM or ACCEPTING emotional state")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: The elevator doors open onto an undefined space\u2014not a lobby, not a street, but something that cannot be described within the system's vocabulary. The subjects step out together, or separately, or not at all. They are no longer trapped. They are no longer guilty. They carry the weight of their choices, but they, but forward into whatever comes next. The Archive completes its primary function and closes.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Partial Integration (The Weight)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "One or two subjects achieve integration while others remain in denial or collapse. The resulting balance is asymmetrical\u2014the subjects who continue, carrying weight that unresolved guilt. These endings reflect the realistic outcomes where complete resolution is rare.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- At least one subject: Suppression Index < 25, Trust > 60, Stability > 40\n- At least one subject: Suppression Index 40-60, Trust 40-60\n- One subject: Suppression Index > 60 (in denial/collapse state)\n- Overall System Stability: 35-55\n- Memory Fragment 'name-revelation-final' accessed by at least one subject")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: The integrated subject(s) experience release while others remain trapped. The simulation partially closes\u2014releasing processed data but allowing some subjects to exit while others are recycled into new iterations. The weight of truth is distributed unevenly, creating complex emotional aftermath.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 COLLAPSE ENDINGS")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Collapse endings occur when system stability drops below critical thresholds before suppressed memory can be fully processed. These endings represent failures of the Archive's repair protocol\u2014the system could not sustain consciousness within the corrupted architecture.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Catastrophic Collapse (The Void)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "System Stability reaches zero before any subject achieves integration. All emotional processing fails simultaneously. The simulation fragments into pure noise\u2014architectural elements dissolve, character entities scatter into data fragments.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- System Stability reaches 0\n- Multiple subjects in GLITCH or BROKEN state simultaneously\n- Investigation phase rushed without building trust\n- Major emotional triggers activated in rapid succession\n- Memory Fragment access attempted below minimum trust thresholds")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: Total dissolution. The simulation ceases to exist as coherent architecture. Subjects become part of the Archive's background data\u2014distributed fragments that may surface in future iterations but no conscious continuity. The system requires complete reset from baseline.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Controlled Collapse (The Reset)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "System recognizes imminent catastrophic collapse and initiates controlled Reset. Emotional progress is partially preserved across the reset boundary. Conscious memories are erased while unconscious patterns accumulate.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- System Stability drops below 20 but above 0\n- No subjects in GLITCH state\n- At least one subject in COLLAPSE or BROKEN state\n- Player has made some trust progress\n- System detects unrecoverable trajectory")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: Subjects lose conscious awareness of current iteration but preserving emotional residues. The next iteration begins with slightly lower suppression indices and modified baseline trust values. Progress accumulates across iterations toward eventual breakthrough.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 DEFENSIVE ENDINGS")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Defensive endings occur when subjects' psychological defenses successfully resist all attempts at revelation. The system determines that current conditions cannot produce resolution and initiates protective measures.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Entrenchment (The Stasis)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "All three subjects maintain suppression Indices above 70 throughout investigation. Trust never exceeds 40 with any subject. The system stabilizes at current configuration, unable to progress but unable to collapse.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- All subjects: Suppression Index > 70 for extended period\n- No subject Trust > 50\n- System Stability fluctuates between 40-60 without major excursions\n- Player avoids challenging subjects directly\n- Memory Fragments remain unaccessed")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: Subjects achieve a stable but stagnant equilibrium. The loop continues indefinitely without progress. The simulation becomes a permanent prison of\u2014functional for subjects but offering no possibility of resolution or escape.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Sacrificial Protection (The Barrier)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "One subject sacrifices their own stability to maintain others' defensive structures. The sacrificial subject enters permanent GLITCH state, becoming part of the Archive's defense mechanisms.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- One subject pushed to GLITCH state\n- Other two subjects: Suppression Index > 60\n- System Stability drops below 35\n- Player prioritizes one subject over others\n- Trust imbalance exceeds 30 points between subjects")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: The glitched subject becomes a permanent part of the simulation's defense architecture\u2014appearing as environmental elements, warning signs, glitch artifacts. The remaining subjects are protected from full revelation but cannot progress. The sacrifice is both noble and tragic.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.4 TRANSCENDENT ENDINGS")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Transcendent endings occur when subjects move beyond individual processing to achieve collective understanding. The trauma is not resolved in the conventional sense but transformed into something that no longer requires suppression or processing.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Collective Acceptance (The Understanding)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "All subjects simultaneously access the suppressed memory and achieve a shared perspective on the event. Rather than individual guilt, subjects recognize collective responsibility without individual blame. The trauma transforms into connection.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- All subjects in HALF_AWARE state simultaneously\n- All Trust toward other subjects > 60\n- Suppression Index between 20-40 for all subjects\n- Memory Fragment accessed by all subjects within same phase\n- System Stability > 50 despite emotional intensity")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: Subjects achieve a form of peace that transcends conventional resolution. They do not forget or forgive\u2014they understand. The Archive transforms from a prison into a memorial. The system no longer needs to loop because the truth has been integrated rather than processed.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("The Loop Broken (The Choice)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "Subjects collectively choose to end the simulation without full resolution. They accept incomplete truth as preferable to endless processing. The Archive respects their agency and concludes.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trigger Conditions:\n- All subjects in CALM state\n- Trust between all subjects > 70\n- Player has facilitated dialogue between subjects\n- Subjects express desire to end simulation\n- Memory Fragment partially accessed\n- System Stability > 65")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Narrative Outcome: A conscious choice to accept limitation. The subjects do not achieve full integration but they achieve consensus. The simulation ends because they choose to end it\u2014not because it resolved but because they are ready to stop. A quiet dignity in accepting partial truth.", font: "Times New Roman", size: 22, color: colors.body })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 2: TRIGGER CONDITIONS MATRIX
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION II: TRIGGER CONDITIONS MATRIX")] }),
      
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The following matrix defines the specific trigger conditions that influence ending probability. Each condition category modifies the probability of certain endings occurring. Conditions are evaluated at the moment of transition calculation\u2014typically when a Memory Fragment is accessed or when System Stability crosses a threshold.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // Trigger Conditions Table
      new Table({
        columnWidths: [2500, 3430, 3430],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Condition", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Effects", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Endings Favored", bold: true, size: 22 })] })] })
            ]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "High Trust (All > 70)", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Reduces suppression resistance; Increases cooperation between subjects", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Integration, Transcendent", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Low Trust (Any < 20)", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Increases defensive response; Triggers isolation behaviors", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Collapse, Defensive", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Stability < 30", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Activates glitch effects; Accelerates emotional deterioration", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Collapse", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Stability > 70", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Allows exploration of difficult memories; Enables integration attempts", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Integration, Transcendent", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Suppression < 25", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character can access difficult memories; Enables truth processing", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Integration", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Suppression > 75", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Strong resistance to memory access; Defensive escalation", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Defensive, Collapse (if pushed)", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Memory Fragment Accessed", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Triggers emotional response; Progresses narrative; May destabilize if unprepared", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "All endings possible", size: 20 })] })] })
          ]})
        ]
      }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
        children: [new TextRun({ text: "Table 2-1: Trigger Condition Effects", size: 18, italics: true, color: colors.secondary })] }),
      
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 3: CHARACTER-SPECIFIC OUTCOMES
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION III: CHARACTER-SPECIFIC OUTCOMES")] }),
      
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Each character has unique resolution paths that depend on their psychological profile and relationship with the suppressed memory. The following sections detail character-specific end states and the conditions that trigger them.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Viktor Resolution Paths")] }),
      new Paragraph({ spacing: { before: 200, after: 150 }, children: [new TextRun({ text: "Viktor's arc centers on the conflict between control and guilt. His resolution paths reflect different relationships with responsibility and failure.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Acceptance Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Viktor accepts that the failure occurred but does not define himself by it.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "He transitions from obsessive control to compassionate maintenance.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "His maintenance becomes genuine care rather than defensive compensation.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "He forgives himself not because he deserves it, but because endless punishment helps no one.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust > 75, Suppression Index < 20, Stability > 50, Player acknowledges failure without absolving responsibility")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Collapse Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Viktor's control mechanisms fail catastrophically under sustained pressure.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "He becomes non-functional, unable to maintain even basic composure.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "The system may preserve his core as a collapsed state or reset depending on progress.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "This represents the danger of pushing too hard without building foundation.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust < 30, repeated failures to maintain control, Suppression Index > 60, System Stability < 30")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Defensive Entrenchment Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Viktor doubles down on control mechanisms, constructing elaborate rationalizations.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "He convinces himself that he did everything correctly; the outcome was unavoidable.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "This state is stable but prevents all progress toward resolution.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "He may become hostile toward anyone who suggests otherwise.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust < 40, Suppression Index never drops below 60, Player's challenges are deflected, System Stability fluctuates 50-70")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Livia Resolution Paths")] }),
      new Paragraph({ spacing: { before: 200, after: 150 }, children: [new TextRun({ text: "Livia's arc centers on the conflict between rationality and fear. Her resolution paths reflect different relationships with truth and avoidance.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Integration Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Livia accepts that her analysis cannot protect her from emotional consequences.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She integrates feeling into her analytical framework rather than treating it as interference.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Her deletions are acknowledged as human error rather than systematic failure.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She becomes more complete by accepting limitation rather than by eliminating it.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust > 70, Suppression Index < 25, accessed her own deleted data, Stability > 45")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Shutdown Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Livia responds to emotional pressure by shutting down all feeling.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She becomes purely analytical, functional but disconnected from emotional reality.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "The Archive may preserve her as a functional element without emotional processing.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "This represents safety through disconnection\u2014protected but incomplete.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust < 40, faced deleted data, Suppression Index remains high, System Stability > 50")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Paranoid Break Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Livia's analytical abilities turn against perceived threats.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She constructs elaborate theories about conspiracies within the Archive.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Her trust degrades toward everyone, including the player.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She may become dangerous to the simulation's stability through coordinated defense.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust < 20, accessed disturbing data, Suppression Index fluctuates wildly, System Stability < 40")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Mara Resolution Paths")] }),
      new Paragraph({ spacing: { before: 200, after: 150 }, children: [new TextRun({ text: "Mara's arc centers on the conflict between truth-seeking and self-doubt. Her resolution paths reflect different relationships with perception and validation.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Validation Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Mara's perceptions are validated by the revelation of suppressed truth.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She transforms from unreliable narrator to trusted truth-teller.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Her intuitions are recognized as genuine perception rather than delusion.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She may become a guide for other subjects toward integration.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust > 80, Suppression Index < 30, accessed name revelation, Stability > 40, Player consistently validated her perceptions")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Fragmentation Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Mara loses all ability to distinguish between perception and delusion.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She becomes a generator of noise\u2014truths mixed with fantasies indiscriminately.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She may become a permanent glitch entity, speaking fragmented truth from within the Archive.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "This represents the cost of perception without grounding.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust < 30, repeated dismissals, Suppression Index near 0, System Stability < 25")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Sacrifice Path")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Mara deliberately fragments herself to reveal truth to others.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "She becomes a conduit for suppressed content at the cost of her own coherence.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Her sacrifice enables other subjects' integration while she remains in broken/glitch state.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "This represents self-transcendence through self-destruction.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Requirements: Trust > 60 toward others, Trust < 40 toward self, Suppression Index < 20, Player present during revelation, System Stability > 35")] }),
      
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 4: STABILITY THRESHOLDS
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION IV: STABILITY THRESHOLDS")] }),
      
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The System Stability meter determines which ending categories are available. At certain thresholds, specific endings become impossible or inevitable. The following defines the relationship between stability and possible outcomes.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 High Stability Zone (70-100)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "At high stability, the Archive maintains coherent architecture and subjects can explore emotionally difficult content without immediate collapse. Integration and Transcendent endings are most accessible. Defensive endings become more likely if subjects resist exploration. Collapse endings are nearly impossible unless triggered by specific catastrophic events.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Medium Stability Zone (40-69)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "At medium stability, all ending categories remain possible. The Archive experiences occasional glitch effects but subjects maintain coherent processing. This is the optimal zone for investigation and emotional work\u2014enough instability to allow access to difficult content, enough stability to process it.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Low Stability Zone (15-39)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "At low stability, the Archive experiences frequent architectural instability. Subjects may experience involuntary glitch effects. Integration becomes difficult as processing capacity degrades. Defensive and Collapse endings become more probable. Transcendent endings require exceptional trust and cooperation.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.4 Critical Zone (0-14)")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "At critical stability, only Collapse endings are available. The Archive cannot sustain coherent consciousness. All subjects will experience fragmentation to some degree. The only question is whether the collapse is total (catastrophic) or controlled (preserves some progress). No integration or transcendent endings are possible from this state.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 5: NARRATIVE BRANCH MAPPING
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION V: NARRATIVE BRANCH MAPPING")] }),
      
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The following diagrams the major narrative branches available through the simulation. Each branch represents a distinct approach to the Archive's resolution, with specific decision points and emotional investments required.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 The Investigation Branch")] }),
      new Paragraph({ spacing: { before: 150, after: 100 }, children: [new TextRun({ text: "Focus: Gathering information, building trust, accessing Memory Fragments systematically. Required: Balanced approach to all subjects, moderate emotional engagement, systematic floor exploration. Leads to: Integration endings if trust is built effectively; Defensive endings if subjects feel analyzed rather than connected.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 The Emotional Branch")] }),
      new Paragraph({ spacing: { before: 150, after: 100 }, children: [new TextRun({ text: "Focus: Building emotional connection, processing subjects' feelings, creating safe space for vulnerability. Required: High emotional engagement, prioritizing trust over information, patient exploration at subjects' pace. Leads to: Transcendent endings if connections are genuine; Partial Integration if connections are uneven.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 The Challenge Branch")] }),
      new Paragraph({ spacing: { before: 150, after: 100 }, children: [new TextRun({ text: "Focus: Directly confronting denial, pushing toward revelation, refusing to accept deflection. Required: High tolerance for emotional volatility, willingness to destabilize, prioritizing truth over comfort. Leads to: Collapse if pushed too hard; Breakthrough if timing is right.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.4 The Support Branch")] }),
      new Paragraph({ spacing: { before: 150, after: 100 }, children: [new TextRun({ text: "Focus: Maintaining subjects' stability, providing comfort, avoiding traumatic triggers. Required: Emotional attunement, patience, willingness to delay gratification of Leads to: Defensive endings (Entrenchment) if prolonged; Gradual Integration if support evolves into gentle challenge.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.5 The Balance Branch (Recommended)")] }),
      new Paragraph({ spacing: { before: 150, after: 100 }, children: [new TextRun({ text: "Focus: Alternating between investigation and emotional connection, pushing gently while maintaining safety, respecting subjects' pace while advancing toward truth. Required: Adaptive emotional intelligence, careful monitoring of stability, building trust with all subjects simultaneously. Leads to: Full Integration (highest probability); Partial Integration or Collective Acceptance as secondary outcomes.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      // Final Note
      new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: "This Branching Consequence Map establishes all possible outcomes for ELEVATOR.EXE \u2013 FRACTURED LOOP. The production may not declare complete until all ending paths have been implemented and tested within the simulation architecture.", font: "Times New Roman", size: 22, bold: true, color: colors.primary })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Every choice opens a door. Every door changes what waits beyond it.")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/z/my-project/download/ELEVATOR_EXE_BRANCHING_MAP.docx', buffer);
  console.log('Branching Consequence Map document generated successfully.');
});
