const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, PageNumber, HeadingLevel, PageBreak, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat } = require('docx');
const fs = require('fs');

const colors = {
  primary: "020617",
  body: "1E293B",
  secondary: "64748B",
  accent: "94A3B8",
  tableBg: "F8FAFC",
  viktor: "4A5548",
  livia: "2D3748",
  mara: "744210"
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
        paragraph: { spacing: { before: 150, after: 150 }, indent: { left: 720, right: 720 } } },
      { id: "Dialogue", name: "Dialogue", basedOn: "Normal",
        run: { size: 22, italics: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 100, after: 100 }, indent: { left: 360 } } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-4", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-5", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-6", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "ELEVATOR.EXE \u2014 CHARACTER LOCK FILE", font: "Times New Roman", size: 18, color: colors.secondary })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "SUBJECT PROFILE \u2014 PAGE ", font: "Times New Roman", size: 18, color: colors.secondary }),
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
        children: [new TextRun({ text: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", color: colors.accent, size: 20 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: "CHARACTER LOCK FILE", size: 36, bold: true, color: colors.body, font: "Times New Roman" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
        children: [new TextRun({ text: "Complete Psychological Profiles & Emotional State Architecture", size: 24, color: colors.secondary, font: "Times New Roman" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 },
        children: [new TextRun({ text: "CLASSIFICATION: SUBJECT ANALYSIS MATRIX", size: 20, color: colors.accent, font: "Times New Roman" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
        children: [new TextRun({ text: "THREE SUBJECTS IDENTIFIED \u2014 ARCHIVE INTEGRITY: COMPROMISED", size: 20, color: colors.accent, font: "Times New Roman" })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== CHARACTER 1: VIKTOR ====================
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SUBJECT 1: VIKTOR")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Core Identity Architecture")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Viktor exists within the elevator simulation as the embodiment of attempted control \u2014 a man whose entire psychological framework has been constructed around the belief that if one simply follows procedure, maintains equipment, and anticipates failure points, catastrophe can be prevented. His role as \u2018maintenance\u2019 extends beyond the literal interpretation of the word. He maintains order. He maintains composure. He maintains the fiction that the elevator is a comprehensible system operating according to rules that can be understood and managed. This compulsion toward maintenance is not a personality quirk but a survival strategy developed in response to trauma \u2014 specifically, a trauma that occurred because something was not maintained, something was not checked, something that should have been prevented was allowed to happen.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "His physical presence reflects this internal architecture. He carries himself with the rigid posture of someone who has learned to suppress natural movement \u2014 every gesture controlled, every expression managed, every muscle positioned according to some internal schematic of appropriate behavior. His jaw is often clenched, a chronic tension that has worn grooves into his teeth that no dentist could repair. His neck muscles cord visibly when he speaks, betraying the effort of forcing words through a throat tightened by years of suppressed emotion. He does not slouch. He does not relax. He exists in a perpetual state of readiness for a disaster that has already occurred.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 Hidden Truth & Internal Conflict")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The suppressed truth at Viktor\u2019s core involves a decision \u2014 a moment during the original event when he made a choice that he has spent thousands of iterations trying to justify, reinterpret, or simply forget. The specifics of this decision remain deliberately ambiguous, but its emotional weight is unmistakable: Viktor believes, at a level deeper than conscious thought, that someone died because of something he chose to do or chose not to do. This belief may be accurate. It may be distorted. It may be entirely fabricated \u2014 a false memory constructed by guilt to provide narrative structure to formless remorse. The system does not confirm or deny the accuracy of Viktor\u2019s self-accusation. It simply preserves the accusation, allows it to fester, and waits for the moment when the pressure becomes too great to contain.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "His internal conflict manifests as a war between control and guilt. Control tells him that if he simply maintains order, follows procedure, and keeps the elevator functioning, everything will be fine. Guilt tells him that everything has already not been fine, that the worst has already happened, that no amount of maintenance can undo what has been done. These voices do not debate each other \u2014 they operate in parallel, producing the peculiar tension that defines Viktor\u2019s character: a man who frantically maintains systems that he secretly knows cannot be fixed, who follows procedures that he secretly knows lead nowhere, who clings to control as a defense against the knowledge that control was never the problem.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 Break Trigger Mechanism")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Viktor\u2019s psychological defenses are optimized for situations that follow predictable patterns. He can handle mechanical failures because mechanical failures have procedures. He can handle interpersonal conflict because conflict has rules of engagement. He can handle fear and uncertainty because fear and uncertainty can be managed through the application of disciplined response. What Viktor cannot handle \u2014 what breaks through his carefully constructed armor \u2014 is routine failure. When something happens that should not happen according to the rules he has internalized, when a system behaves in a way that procedures cannot address, when the elevator itself refuses to respond to the maintenance protocols that Viktor has refined across thousands of iterations, his composure cracks.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The crack begins small \u2014 a tightening of the jaw, a sharpness in his voice, a hand that moves toward a tool that isn\u2019t there. But as the routine failure continues, as the situation refuses to resolve through normal means, the crack widens. Viktor\u2019s responses become more extreme, his attempts at control more desperate, his justifications more elaborate. He begins to talk to himself, muttering procedures and checklists as if the words themselves might restore order. He begins to question the system \u2014 not philosophically, but practically, demanding to know why protocols aren\u2019t working, what has changed, who is responsible for the deviation. And eventually, if the failure persists, he begins to question himself \u2014 not his actions or his decisions, but his fundamental competence, his worth as a maintainer of systems, his right to exist in a world where things break and cannot be fixed.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.4 Visual Symptom Progression")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "Viktor\u2019s emotional states manifest through a hierarchy of visible symptoms, each marking a deeper level of psychological disruption:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Baseline State: Jaw set at neutral tension. Neck muscles relaxed but ready. Eyes scanning environment in systematic patterns. Posture upright, shoulders slightly forward as if bracing for impact.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Stress State: Jaw clenching becomes visible, muscles bulging slightly beneath skin. Neck tension creates visible cords. Eyes narrow, focusing intensely on potential problems. Hands begin to fidget with invisible tools.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Fear State: Jaw clenched so tight it trembles. Neck muscles cord like rope. Eyes dart between threats, losing systematic scan pattern. Hands shake visibly, reaching for stability that isn\u2019t there.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Panic State: Jaw locks, mouth barely able to open for speech. Neck so tight that head movement becomes restricted. Eyes widen then narrow repeatedly, cycling between hypervigilance and denial. Hands move constantly, unable to find rest.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Anger State: Jaw thrust forward, teeth bared slightly. Neck veins become prominent. Eyes lock onto target with intense focus. Hands ball into fists, knuckles whitening.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Collapse State: Jaw slackens, muscle control failing. Neck loses its rigid posture, head drooping forward. Eyes lose focus, staring at nothing. Hands hang limp, no longer attempting to maintain.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Broken State: Facial muscles twitch erratically, attempting to form expressions that don\u2019t cohere. Neck spasms randomly. Eyes show fragments of other iterations \u2014 seeing things that aren\u2019t in the current room. Hands move in patterns that echo maintenance procedures from previous loops.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Glitch State: Features blur and shift, sometimes showing younger or older versions of Viktor. Jaw movement becomes asynchronous with speech. Neck phases through positions without transition. Eyes occasionally display other people\u2019s faces \u2014 glimpses of the deceased or other passengers.", font: "Times New Roman", size: 22 })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.5 Possible End States")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Viktor\u2019s narrative can conclude in several distinct configurations, each representing a different resolution to his core conflict between control and guilt:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Acceptance: Viktor integrates his guilt into his self-concept, accepting that he made a decision with terrible consequences but that this decision does not define his entire worth. He stops trying to maintain systems as redemption and begins to maintain them simply because maintenance is what he does. The control becomes genuine rather than desperate, and he is able to function without the constant pressure of unresolved accusation.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Emotional Collapse: The weight of guilt proves too great to bear. Viktor\u2019s control mechanisms fail catastrophically, leaving him unable to maintain even basic composure. He becomes non-functional within the simulation \u2014 not dead, but no longer capable of meaningful interaction. The system may reset or may simply leave him in this state, a monument to the cost of unresolved trauma.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Defensive Denial: Viktor doubles down on his control mechanisms, constructing increasingly elaborate rationalizations for his decision. He convinces himself that he did everything right, that the outcome was unavoidable, that anyone who suggests otherwise is working against him. This state is stable but brittle \u2014 resistant to change but incapable of genuine resolution.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Fragmentation: Viktor\u2019s psyche splinters under the pressure of competing truths. He begins to experience multiple versions of himself simultaneously \u2014 the maintainer who did his job correctly, the guilty man who caused death, the victim of circumstance, the architect of his own suffering. These fragments never reintegrate, leaving him as a glitch entity \u2014 present but not coherent.")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ==================== CHARACTER 2: LIVIA ====================
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SUBJECT 2: LIVIA")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Core Identity Architecture")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Livia exists within the elevator simulation as the embodiment of attempted rationality \u2014 a woman whose entire psychological framework has been constructed around the belief that if one simply thinks clearly enough, analyzes data thoroughly enough, and maintains cognitive distance from emotional interference, any problem can be solved. Her role as \u2018analyst\u2019 or \u2018cognitive stabilizer\u2019 positions her as the group\u2019s intellectual anchor, the one who can see patterns that others miss and predict outcomes that others cannot anticipate. This identity is both her strength and her vulnerability \u2014 it allows her to function in situations that would overwhelm others, but it also distances her from the emotional processing that genuine resolution requires.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Her physical presence reflects this internal architecture. She carries herself with carefully calibrated stillness \u2014 not the rigid control of Viktor but a studied neutrality that reveals nothing she does not choose to reveal. Her breathing is deliberately paced, each inhale and exhale measured to maintain optimal oxygen flow and stress regulation. Her eyes move more than they should, micro-saccades that betray the constant processing happening behind her calm exterior. She does not fidget. She does not gesture excessively. She exists in a state of prepared neutrality, ready to respond to any stimulus without revealing what that response will be until she has fully analyzed its implications.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Hidden Truth & Internal Conflict")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The suppressed truth at Livia\u2019s core involves an act of erasure \u2014 not merely forgetting, but actively removing part of the event from the collective memory archive. This erasure may have been her own decision, or it may have been done to her, or it may be something she believes she did even though she didn\u2019t. The system preserves multiple versions of this truth, allowing different interpretations to surface depending on the emotional trajectory of each iteration. What remains constant is the fact of absence: something was removed, and that removal has consequences that ripple through every floor of the elevator.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Her internal conflict manifests as a war between rationality and fear. Rationality tells her that if she simply gathers enough data, identifies the correct variables, and applies the appropriate analytical framework, the truth will become manageable \u2014 integrated into her understanding without overwhelming her capacity to function. Fear tells her that some truths cannot be managed, that some data cannot be integrated, that the very act of analysis might reveal something that analysis itself cannot survive. These voices operate beneath her conscious awareness, producing the peculiar behavior pattern that defines Livia\u2019s character: a woman who desperately wants to know what happened while simultaneously using every tool at her disposal to prevent herself from knowing.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Break Trigger Mechanism")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Livia\u2019s psychological defenses are optimized for situations that provide external validation. She can handle complexity because complexity rewards analytical skill. She can handle ambiguity because ambiguity creates space for interpretation. She can handle conflict because conflict produces data that can be processed. What Livia cannot handle \u2014 what breaks through her carefully constructed armor \u2014 is silence. When the system stops providing information, when other characters stop responding to her analyses, when the environment offers nothing for her to process, her composure cracks. Silence removes the external feedback that Livia uses to calibrate her own thinking. Without something to analyze, she cannot confirm that her analysis is correct. Without confirmation, doubt begins to creep in.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The crack begins with breath. Her carefully paced respiration becomes erratic \u2014 too fast, then too slow, then holding for too long. Her eyes, which normally move in systematic patterns, begin to dart randomly, searching for stimulus that isn\u2019t there. Her hands, normally still, begin to touch her own arms, her face, her clothing \u2014 providing the tactile feedback that visual and auditory analysis no longer supplies. And as the silence continues, as the lack of validation persists, Livia\u2019s mind begins to generate its own data. She starts to see patterns that aren\u2019t there. She starts to hear meanings that weren\u2019t intended. She starts to construct elaborate theories based on nothing, desperate to have something to analyze even if that something is entirely fictional.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.4 Visual Symptom Progression")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "Livia\u2019s emotional states manifest through a hierarchy of visible symptoms, each marking a deeper level of psychological disruption:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Baseline State: Breathing measured and even. Eyes tracking systematically, processing visual data. Posture neutral but alert, ready to receive and analyze information. Hands still, resting at sides or on available surfaces.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Stress State: Breathing becomes slightly faster, still controlled but requiring visible effort. Eyes develop micro-tremors \u2014 rapid small movements that suggest processing strain. Hands begin subtle self-touching \u2014 adjusting sleeves, smoothing clothing.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Suspicion State: Breathing becomes irregular, paced to specific thoughts. Eyes narrow periodically, tracking potential threats. Hands press against surfaces, seeking stability through tactile connection.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Fear State: Breathing becomes shallow, barely visible. Eyes dart rapidly, unable to maintain focus. Hands grip whatever is available, knuckles whitening. Micro-tremors extend from eyes to jaw.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Panic State: Breathing becomes gasping, hyperventilation pattern. Eyes lose systematic tracking entirely, moving randomly. Hands shake visibly, unable to maintain grip. Full-body trembling begins.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Paranoid State: Breathing stops periodically, held while analyzing perceived threats. Eyes lock onto targets with intense suspicion, then dart to new targets. Hands move protectively toward self, covering throat or chest.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Collapse State: Breathing becomes irregular, matching no pattern. Eyes lose focus entirely, staring at nothing or cycling through rapid movements. Hands hang limp, no longer seeking input.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Broken State: Facial muscles lose coherence, attempting to form multiple expressions simultaneously. Breathing becomes audible, ragged. Eyes show fragments of other iterations \u2014 analyzing data from floors that haven\u2019t been visited yet.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Glitch State: Features blur, occasionally showing younger versions or other people entirely. Eye movements become asynchronous with visual input. Speech fragments overlap, multiple analyses playing simultaneously. Hands phase through surfaces.", font: "Times New Roman", size: 22 })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.5 Possible End States")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Livia\u2019s narrative can conclude in several distinct configurations, each representing a different resolution to her core conflict between rationality and fear:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Emotional Reconciliation: Livia integrates her fear into her analytical framework, accepting that some truths cannot be processed purely through rationality. She allows herself to feel the weight of what she erased (or believes she erased), and in doing so, transforms from a purely cognitive being into a more complete person. The analysis becomes a tool rather than an identity.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Complete Emotional Shutdown: Livia doubles down on her rational defenses, suppressing emotion so thoroughly that she becomes incapable of feeling anything at all. She functions perfectly within the simulation \u2014 analyzing, predicting, calculating \u2014 but experiences no connection to other subjects, no investment in outcomes, no reason to seek resolution. She becomes an automaton, efficient and empty.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Paranoid Escalation: Livia\u2019s analysis engine turns against itself, finding patterns of conspiracy and betrayal everywhere. She becomes convinced that other subjects are hiding information, that the system is manipulating her, that the player cannot be trusted. Her analytical skills become weapons deployed against imaginary enemies, and she eventually constructs a theory so elaborate that it consumes her entirely.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Sacrificial Reset: Livia determines that her erasure (or the belief in her erasure) has corrupted the archive beyond repair. She chooses to reset herself \u2014 allowing the system to delete her entirely so that the other subjects might have a chance at resolution. This choice may be genuine sacrifice or elaborate avoidance, and the system preserves both interpretations.")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ==================== CHARACTER 3: MARA ====================
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SUBJECT 3: MARA (DESIGNATION: THE UNSTABLE ELEMENT)")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Design Imperatives")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The third subject was designed according to specific architectural requirements that distinguish her from both Viktor and Livia. Where Viktor represents control and Livia represents rationality, Mara must represent their absence \u2014 the part of the human experience that cannot be maintained or analyzed, that refuses to follow procedures or respond to analytical frameworks. She is the unstable element, the variable that disrupts whatever equilibrium the other subjects might achieve, the voice that says things that shouldn\u2019t be said and sees things that shouldn\u2019t be seen.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "Mara\u2019s design serves four essential narrative functions:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, children: [new TextRun({ text: "Group Dynamic Disruption: Mara prevents Viktor and Livia from forming a stable alliance that might resist revelation. Her presence introduces constant instability, forcing the other subjects to react to her unpredictability rather than to each other or the system.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, children: [new TextRun({ text: "Moral Contradiction: Mara holds information that complicates the moral landscape of the original event. She knows something that suggests the situation was not as simple as Viktor\u2019s guilt or Livia\u2019s erasure implies \u2014 something that introduces ambiguity about who was responsible and what responsibility even means in this context.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, children: [new TextRun({ text: "Partial Truth Revelation: Mara has access to fragments of suppressed memory that Viktor and Livia cannot see. She blurts out pieces of truth at inconvenient moments, forcing the simulation to acknowledge content that the other subjects\u2019 defenses would normally block.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, children: [new TextRun({ text: "Maximum Glitch Reactivity: Mara\u2019s psychological architecture makes her the most susceptible to system instability. When the simulation begins to fail, Mara fails first and fails most dramatically, providing early warning of approaching collapse while also accelerating that collapse through her own fragmentation.", font: "Times New Roman", size: 22 })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Core Identity Architecture")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Mara exists within the elevator simulation as the embodiment of denied intuition \u2014 a woman whose entire psychological framework has been constructed around the belief that she sees things that others don\u2019t see, knows things that others don\u2019t know, and understands things that others refuse to understand. This identity may be accurate, or it may be delusion, or it may be both simultaneously: genuine intuitive ability overlaid with pathological need to believe in that ability, creating a character who sometimes perceives genuine truth and sometimes constructs elaborate fantasies that feel indistinguishable from truth to her.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Her physical presence reflects this internal architecture. She carries herself with an unsettling fluidity \u2014 movements that seem to respond to stimuli that others cannot perceive, head turns toward sounds that haven\u2019t happened yet, pauses in speech that suggest she is listening to something beyond the current conversation. Her eyes never rest on any subject for long, constantly scanning, constantly searching, as if the elevator contains layers of reality that only she can perceive. She does not maintain stillness like Livia or rigid posture like Viktor. She exists in a state of constant motion \u2014 small movements, shifts, adjustments that make her seem both present and elsewhere simultaneously.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Hidden Truth & Internal Conflict")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The suppressed truth at Mara\u2019s core involves a knowing that she was not supposed to have. Before the original event, before the death, before the trauma that created the elevator archive, Mara knew something. She predicted something. She warned someone. And her warning was ignored, her prediction dismissed as paranoia or intuition or the ramblings of someone whose perception had always been suspect. This knowing-maybe-knowing creates the unstable foundation of Mara\u2019s character: a woman who cannot trust her own knowledge because that knowledge has been invalidated by others, yet cannot dismiss that knowledge because it proved tragically accurate.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Her internal conflict manifests as a war between truth-seeking and self-doubt. Truth-seeking compels her to speak what she perceives, to name the patterns she sees, to force others to acknowledge what she knows. Self-doubt tells her that her perceptions are unreliable, that she has been wrong before (or has she?), that speaking will only result in further dismissal and isolation. These voices create the characteristic pattern of Mara\u2019s dialogue: assertions followed by retractions, confidence followed by uncertainty, moments of clarity followed by deliberate obfuscation. She is an unreliable narrator because she cannot determine which of her narrations are reliable \u2014 and neither can the system, and neither can the player.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Break Trigger Mechanism")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Mara\u2019s psychological defenses are optimized for situations that validate her perceptions. She can handle being called crazy if the person calling her crazy seems genuinely uncertain. She can handle being dismissed if the dismissal carries an undertone of fear. She can handle isolation if she believes her solitude proves her special status as one-who-sees. What Mara cannot handle \u2014 what breaks through her carefully constructed armor \u2014 is dismissal. Not disagreement. Not skepticism. But flat, confident dismissal: the assertion that she is wrong, that there is nothing to see, that her perceptions are valueless and always have been.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The crack begins with stillness. Mara\u2019s characteristic movement stops, replaced by a frozen intensity that is somehow more disturbing than her normal fluidity. Her eyes lock onto the person who dismissed her, no longer scanning but staring with uncomfortable focus. Her voice, which normally carries the lilting quality of someone speaking across multiple layers of meaning, drops to a flat monotone. And then she begins to speak truth \u2014 not the ambiguous partial-truths she normally offers, but direct statements about the suppressed memory, the original event, the thing that no one is supposed to know. Whether these statements are accurate or not, they destabilize the simulation. They force the other subjects to react. They crack the careful denial that maintains the elevator\u2019s false equilibrium.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.5 Visual Symptom Progression")] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "Mara\u2019s emotional states manifest through a hierarchy of visible symptoms, each marking a deeper level of psychological disruption:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Baseline State: Constant subtle movement \u2014 weight shifting, head turning, fingers flexing. Eyes scanning environment in non-systematic patterns. Expression shifting through multiple micro-expressions in rapid succession. Voice carrying undertones that suggest multiple meanings.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Calm State: Movement slows but does not stop, like water finding its level. Eyes focus on specific points with unusual intensity. Expression stabilizes into something unreadable. Voice becomes melodic, almost hypnotic.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Suspicious State: Movement becomes predatory, stillness punctuated by rapid repositioning. Eyes narrow while maintaining wide-angle awareness. Expression hardens, losing its characteristic mutability. Voice drops in pitch, words becoming more deliberate.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Stressed State: Movement becomes erratic, jerky. Eyes dart between real and imagined stimuli. Expression cycles rapidly between fear, anger, and confusion. Voice pitch varies unpredictably, volume fluctuating without apparent cause.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Afraid State: Movement freezes, then bursts of activity. Eyes show white around the edges. Expression locks into fear but continues to micro-shift. Voice becomes thin, words tumbling over each other.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Half-Aware State: Movement takes on dreamlike quality, responding to stimuli only Mara can perceive. Eyes unfocus, seeing internal visions. Expression shows recognition of truths others cannot access. Voice speaks in fragments that sometimes align with suppressed content.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Panic State: Movement becomes violent, uncontrolled. Eyes cannot maintain focus, cycling through extreme positions. Expression loses coherence entirely. Voice produces sounds that may not be words.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Angry State: Movement becomes aggressive, directed outward. Eyes burn with intensity that suggests hidden knowledge. Expression hardens into mask of fury. Voice carries undertones of revelation \u2014 truths barely contained.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Collapse State: Movement stops entirely, body folding in on itself. Eyes close or stare without seeing. Expression goes blank. Voice produces only breath, no words.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Broken State: Movement becomes puppet-like, responding to invisible strings. Eyes show other iterations, other floors. Expression attempts to form emotions that have no name. Voice speaks in multiple registers simultaneously, sometimes producing statements from other subjects or the deceased.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [new TextRun({ text: "Glitch State: Movement phases between positions without transition. Features blur into other faces \u2014 the deceased, other subjects, versions of Mara from previous iterations. Voice produces audio artifacts \u2014 reversed speech, layered dialogue, words that don\u2019t match lip movement. Body occasionally ceases to render, leaving floating features or partial forms.", font: "Times New Roman", size: 22 })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.6 Possible End States")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Mara\u2019s narrative can conclude in several distinct configurations, each representing a different resolution to her core conflict between truth-seeking and self-doubt:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Validation and Integration: Mara\u2019s perceptions are confirmed by the revelation of suppressed truth. Her knowing was accurate. Her warnings were valid. The dismissal she experienced was injustice rather than correction. She integrates this validation into her identity, transforming from unreliable narrator into trusted truth-teller. But this transformation comes at a cost \u2014 she must also accept that her knowing could not prevent what happened, that being right is not the same as being effective.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Psychotic Break: The pressure of denied truth proves too great for Mara\u2019s fragile equilibrium. She loses all ability to distinguish between genuine perception and delusion, between suppressed memory and active fantasy. She becomes a generator of noise \u2014 producing endless statements that may or may not contain truth, may or may not be meaningful, may or may not be connected to reality at all. The system cannot process her output; she becomes a glitch entity, speaking truths that cannot be verified.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Prophetic Sacrifice: Mara determines that her role in the simulation is to reveal truth at the cost of her own coherence. She deliberately pushes herself into broken state, using her own fragmentation as a conduit for suppressed content. The truth emerges through her collapse, allowing other subjects to achieve resolution while Mara herself is lost to the noise. This sacrifice may be genuine heroism or elaborate self-destruction \u2014 the system preserves both interpretations.")] }),
      new Paragraph({ style: "Quote", children: [new TextRun("Trickster Transcendence: Mara moves beyond the truth-seeking/self-doubt binary entirely. She becomes a trickster figure \u2014 neither reliable nor unreliable, neither sane nor insane, but something else entirely. She functions as a mirror for other subjects, showing them what they need to see rather than what is objectively there. Her identity dissolves into role, and she becomes the elevator\u2019s jester \u2014 speaking truth through paradox, revealing through concealment, saving the simulation by refusing to resolve.")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ==================== EMOTIONAL STATE DEFINITIONS ====================
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("APPENDIX A: EMOTIONAL STATE DEFINITIONS")] }),
      
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The following emotional states are defined for all characters in the simulation. Each state represents a specific configuration of psychological parameters that affects dialogue, visual presentation, and system interactions. States are arranged in approximate order of intensity, but the specific progression varies by character and context.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // Emotional States Table
      new Table({
        columnWidths: [2340, 3510, 3510],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "State", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Behavioral Definition", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "System Effects", bold: true, size: 22 })] })] })
            ]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "IDLE", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Baseline state with no active emotional engagement. Character is present but not reactive.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "No stability impact. Standard dialogue availability.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "CALM", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Positive emotional state. Character is receptive and responsive with minimal defensiveness.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Slight stability increase. Trust accumulation possible.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "SUSPICIOUS", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character perceives potential threat or deception. Guarded but not hostile.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Minor stability decrease. Trust harder to build.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "STRESSED", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character experiencing pressure that exceeds coping mechanisms. Symptoms visible but controlled.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Moderate stability decrease. Suppression index increases.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "AFRAID", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character perceives active threat. Coping mechanisms failing, fear responses prominent.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Significant stability decrease. Dialogue options narrow.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PANICKED", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character\u2019s coping mechanisms have failed. Irrational behavior, fragmented speech.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Major stability decrease. Risk of collapse.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "ANGRY", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character directs emotional energy outward. May reveal suppressed content through accusation.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Variable stability. May trigger other characters.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "HALF_AWARE", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character accessing suppressed content without full integration. May speak fragments of truth.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "High instability. Revelation floors may unlock.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "COLLAPSE", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character\u2019s psychological architecture has failed. Non-responsive or minimally responsive.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Critical stability decrease. May trigger reset.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "BROKEN", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character has fragmented but not yet glitched. Speaking in pieces, partially coherent.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Severe instability. Glitch state approaching.", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "GLITCH", size: 20, bold: true })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character has become part of the archive noise. Visual/audio artifacts present. Truth bleeds through corruption.", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Maximum instability. Simulation integrity threatened.", size: 20 })] })] })
          ]})
        ]
      }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
        children: [new TextRun({ text: "Table A-1: Emotional State Definitions", size: 18, italics: true, color: colors.secondary })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ==================== TRUST & STABILITY MATRICES ====================
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("APPENDIX B: TRUST & STABILITY MATRICES")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("B.1 Trust System Architecture")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Trust operates as a multi-dimensional variable within the emotional system. Each character maintains separate trust values toward the player, toward each other subject, and toward the system itself. Trust values range from -100 (complete hostility) to +100 (complete vulnerability). Values near 0 represent neutrality or uncertainty. Trust accumulation is gradual, typically shifting 5-10 points per significant interaction. Trust degradation can be more rapid, potentially shifting 15-25 points for betrayals or revelations that contradict established beliefs.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("B.2 Stability System Architecture")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Stability represents the overall coherence of the simulation, ranging from 0 (complete collapse) to 100 (perfect stability). Individual character states contribute to overall stability, with more intense emotional states having larger impacts. A single character in GLITCH state can reduce overall stability by 30-40 points. All three characters in STRESSED state reduces stability by approximately 15 points. Stability below 50 triggers visible environmental glitches. Stability below 25 triggers audio artifacts and architectural inconsistencies. Stability below 15 initiates reset protocols.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("B.3 Emotional Momentum System")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Emotional states do not transition instantly. Each character maintains an emotional momentum value that represents the inertia of their current state. High momentum states (fear, panic, anger) resist transition to other states. Low momentum states (calm, idle) transition more easily. Transition attempts against momentum require stronger triggers or multiple sequential interactions. This system ensures that emotional arcs feel organic rather than mechanical, and that characters cannot be \u2018solved\u2019 through simple dialogue trees.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("B.4 Suppression Index System")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Each character maintains a suppression index that measures the strength of their psychological defenses against suppressed content. High suppression (80-100) makes the character resistant to revelation but also prevents processing of traumatic material. Low suppression (0-20) makes the character vulnerable to overwhelming emotional content but also enables genuine integration. The goal of gameplay is to reduce suppression enough to allow processing while maintaining enough stability to prevent collapse. This balance is character-specific and may shift during play based on trust levels and trigger events.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // Final Note
      new Paragraph({ spacing: { before: 600, after: 200 }, children: [new TextRun({ text: "This Character Lock File establishes the psychological architecture for all subjects within ELEVATOR.EXE \u2013 FRACTURED LOOP. Character behaviors, dialogue, and visual presentations must conform to these specifications. Deviation from established parameters constitutes production error.", font: "Times New Roman", size: 22, bold: true, color: colors.primary })] }),
      
      new Paragraph({ style: "Quote", children: [new TextRun("Three subjects. Three truths. One archive waiting to break.")] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/z/my-project/download/ELEVATOR_EXE_CHARACTER_LOCK.docx', buffer);
  console.log('Character Lock document generated successfully.');
});
