const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, PageNumber, HeadingLevel, PageBreak, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat } = require('docx');
const fs = require('fs');

// Color scheme - "Midnight Code" for dark psychological thriller
const colors = {
  primary: "020617",      // Midnight Black
  body: "1E293B",         // Deep Slate Blue
  secondary: "64748B",    // Cool Blue-Gray
  accent: "94A3B8",       // Steady Silver
  tableBg: "F8FAFC",      // Glacial Blue-White
  darkBg: "0F172A"        // Dark background
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
      { id: "Atmosphere", name: "Atmosphere", basedOn: "Normal",
        run: { size: 22, italics: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 100, after: 100 }, indent: { left: 360 } } },
      { id: "Quote", name: "Quote", basedOn: "Normal",
        run: { size: 22, italics: true, color: colors.accent, font: "Times New Roman" },
        paragraph: { spacing: { before: 150, after: 150 }, indent: { left: 720, right: 720 } } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-4",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "ELEVATOR.EXE \u2014 WORLD BIBLE", font: "Times New Roman", size: 18, color: colors.secondary })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "CLASSIFIED \u2014 ITERATION LOG ", font: "Times New Roman", size: 18, color: colors.secondary }),
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
      new Paragraph({ 
        alignment: AlignmentType.CENTER, 
        spacing: { before: 100, after: 400 },
        children: [new TextRun({ text: "FRACTURED LOOP", size: 48, color: colors.secondary, font: "Times New Roman" })] 
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", color: colors.accent, size: 20 })] 
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: "WORLD BIBLE", size: 36, bold: true, color: colors.body, font: "Times New Roman" })] 
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 100 },
        children: [new TextRun({ text: "Complete Narrative Architecture & Lore Documentation", size: 24, color: colors.secondary, font: "Times New Roman" })] 
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 },
        children: [new TextRun({ text: "CLASSIFICATION: PSYCHOLOGICAL ARCHIVE RESTORATION PROJECT", size: 20, color: colors.accent, font: "Times New Roman" })] 
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 100 },
        children: [new TextRun({ text: "VERSION: FRACTURED-7.3.ITERATION", size: 20, color: colors.accent, font: "Times New Roman" })] 
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 1: PREMISE ARCHITECTURE
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION I: PREMISE ARCHITECTURE")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 The Fundamental Deception")] }),
      new Paragraph({ style: "Atmosphere", children: [new TextRun("The elevator is not a building transport system. It never was. What the player initially perceives as an ordinary elevator\u2014complete with metallic walls, a floor indicator panel, the familiar hum of machinery, and the occasional mechanical ding\u2014is in fact an elaborate cognitive interface designed to compress, store, and replay emotional memory data. The entire structure operates as a metaphorical rendering engine, translating raw psychological trauma into navigable architectural space. Each button pressed, each door that opens, each floor number that flickers into existence represents the system\u2019s attempt to access and process a specific emotional fragment contained within the collective unconscious of the individuals trapped within its recursive loops.")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The elevator does not move. The elevator has never moved. The sensation of vertical motion\u2014the subtle pressure against the inner ear, the momentary weightlessness of acceleration, the mechanical vibrations traveling through the soles of one\u2019s feet\u2014these are all simulated sensations generated by the interface to provide contextual meaning to what would otherwise be an incomprehensible experience of raw psychological data transfer. The simulation creates movement because the human mind requires spatial metaphors to process abstract emotional content. Without the elevator construct, the experience would be pure chaos: unfiltered emotional frequencies crashing against consciousness like waves against stone.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The floors, therefore, are not physical locations. They are reconstructed emotional fragments\u2014pieces of a shared trauma event that have been digitized, compartmentalized, and stored within the system\u2019s memory banks. Floor B7 might represent a moment of betrayal, frozen in amber, waiting to be re-experienced. Floor 13 could be a suppressed memory of violence, carefully edited to maintain the cognitive stability of the individuals involved. The lobby floor\u2014the supposed ground level where all passengers believe they entered\u2014may not represent a beginning at all, but rather the system\u2019s default loading state, a neutral emotional baseline from which all other fragments branch and diverge.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 The Memory Compression Paradigm")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The system called Elevator.exe operates on principles similar to lossy compression algorithms used in digital media, but applied to human consciousness rather than audio or video data. Just as a JPEG compresses an image by discarding information deemed less essential to human perception, the elevator system compresses traumatic memories by stripping away contextual details that might overwhelm the subjects\u2019 ability to process the core emotional content. Faces blur. Timeline sequences become non-linear. Cause and effect separate into fragmented threads that must be mentally reassembled. The compression allows the trauma to be stored\u2014kept intact without destroying the vessel that contains it\u2014but at the cost of fidelity. Each time the memory is accessed, each time a floor is visited, the decompression process introduces artifacts. Small distortions. Subtle inconsistencies. The emotional truth remains, but the details become increasingly unstable.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "This compression creates the fundamental horror of the elevator experience. The characters within are not trapped in a building. They are trapped inside a corrupted emotional archive\u2014a damaged repository of shared psychological catastrophe. The elevator itself is attempting to repair this archive, cycling through stored memories in search of some stable configuration that would allow the system to complete its processing and release its subjects. But the archive is damaged. Critical data has been suppressed. A key memory\u2014one that binds all others together, that provides the interpretive framework necessary to understand the trauma as a coherent narrative\u2014has been locked away so deeply that even the system cannot access it. And so the elevator loops. Again. And again. And again.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 The Player as Variable")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The player occupies a unique position within the elevator\u2019s architecture. Unlike Viktor, Livia, and the as-yet-undefined third passenger, the player is not a participant in the original trauma event. The player has no suppressed memories lurking within the archive, no emotional data compressed into the system\u2019s storage banks, no personal stake in whatever catastrophe created this recursive prison. The player exists outside the compression algorithm entirely\u2014a consciousness interfacing with the system from an external vantage point. This external position makes the player uniquely valuable to the elevator\u2019s repair protocols, and uniquely dangerous to the psychological equilibrium of the archived subjects.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The system has recognized that it cannot resolve the archive internally. The suppressed memory at the core of the trauma is too deeply buried, protected by psychological defense mechanisms that have been reinforced through countless loop iterations. Each time the elevator replays its floors, the subjects become more entrenched in their patterns of avoidance, their rationalizations, their carefully constructed false narratives that allow them to function within the simulation without confronting the truth. The system needs an outside perspective. A new variable. A consciousness capable of asking questions that the subjects have trained themselves never to ask, of noticing inconsistencies that the subjects have agreed to ignore, of pushing against the emotional momentum that keeps the archive frozen in its current unstable state.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "But the player\u2019s intervention cuts both ways. Every question asked, every trust built or broken, every emotional state that shifts in response to player input sends ripples through the compressed data. The archive becomes more unstable. Walls begin to flicker with events that never occurred. Floor numbers shift to values that shouldn\u2019t exist. Voices from previous iterations bleed into current conversations. The music layers upon itself in discordant harmonies that no composer intended. The player is the key to resolution\u2014but also the catalyst for collapse. If stability drops too far, if the emotional turbulence exceeds the system\u2019s capacity to maintain coherent architecture, the entire simulation may fragment beyond repair. The subjects would not die in any conventional sense. They would become part of the noise\u2014scattered data fragments echoing through corrupted hallways forever.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 2: THE LOOP MECHANICS
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION II: THE LOOP MECHANICS")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 The Architecture of Repetition")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The loop exists as a direct consequence of suppressed truth. The elevator cannot ascend beyond a certain point because the narrative required for upward progress remains locked within the unconscious mind of one of its passengers. The system has attempted countless routes to this truth. It has presented the relevant floor fragments in different sequences. It has adjusted emotional intensity parameters. It has modified environmental variables\u2014lighting, sound design, temperature, even the perceived passage of time\u2014in hopes of creating conditions favorable to spontaneous memory retrieval. None of these interventions have succeeded. The suppression is too strong. The defense mechanisms protecting this particular fragment of trauma have been refined across thousands of iterations into something nearly impervious to external prompting.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The loop, therefore, serves a function beyond mere imprisonment. It is a containment protocol designed to prevent total system collapse while maintaining the possibility of eventual resolution. Each iteration is slightly different from the last\u2014the system makes small adjustments, tests new configurations, attempts to inch closer to the breakthrough moment that would unlock the suppressed memory and allow the archive to complete its processing. Most iterations end the same way: emotional stability degrades past a critical threshold, the simulation becomes increasingly unstable, and the system is forced to reset to a stable baseline. But occasionally, rarely, an iteration produces a new variable. A shift in interpersonal dynamics. A crack in the carefully maintained walls of denial. These small victories accumulate across iterations, creating the possibility that the next loop might be different. That this time, finally, the elevator might find its way through.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Manifestations of Instability")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "When system stability drops below optimal parameters, the compressed data begins to decompress in uncontrolled ways. The architecture that the subjects perceive\u2014the elevator cabin, the hallway beyond each opened door, the distant sounds of other floors\u2014relies on the system\u2019s ability to maintain coherent rendering of emotional content. As instability increases, this rendering becomes increasingly corrupted. The boundaries between floors blur. Memories from different emotional fragments bleed together. The system loses its ability to maintain temporal sequencing, presenting events out of order or superimposing multiple moments into single composite experiences that feel real but cannot have happened.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "The visual manifestations of instability begin subtly. Lighting that flickers at frequencies just below conscious perception. Shadows that move independently of their sources. Reflections in metallic surfaces that show rooms the elevator has never visited. As instability increases, these glitches become more pronounced:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun({ text: "Walls begin to display fragments of events that never occurred\u2014composite memories assembled from compressed data artifacts, showing the subjects in situations that contradict their own narratives of what happened.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun({ text: "The floor indicator panel starts displaying inconsistent numbers, sometimes counting up and down simultaneously, sometimes showing symbols that aren\u2019t numbers at all but emotional markers\u2014glyphs representing fear, guilt, anger, grief.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun({ text: "Voices from previous iterations begin overlapping with current dialogue, creating polyphonic conversations where the same character speaks multiple contradictory statements simultaneously, each representing a different emotional state from a different loop.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun({ text: "The ambient music\u2014initially a subtle emotional underscore\u2014begins layering in reverse, playing multiple tracks simultaneously at different speeds, creating harmonic dissonances that produce visceral anxiety responses in listeners.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun({ text: "Physical objects lose their permanence, shifting position when unobserved, occasionally ceasing to exist entirely, leaving gaps in perception that the mind struggles to rationalize.", font: "Times New Roman", size: 22 })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 The Reset Threshold")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The system maintains a stability meter that measures the overall coherence of the archived emotional data. This meter represents the difference between a simulation that can sustain consciousness and one that fragments into noise. When stability drops below approximately 15 percent, the system initiates emergency reset protocols. All current interactions are terminated. The emotional states of all subjects are reverted to baseline parameters. Environmental variables return to default settings. And the elevator begins again, carrying passengers who have no conscious memory of previous iterations, yet carry the accumulated weight of every loop in their unconscious minds.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The reset is not perfect. Each iteration leaves traces\u2014emotional residues that persist through the reset, subtle modifications to baseline parameters, minute shifts in the starting conditions of the next loop. These accumulated traces create the possibility of eventual breakthrough. After enough iterations, the defense mechanisms protecting the suppressed memory will have been worn down by the constant pressure of partial insights and almost-revelations. After enough iterations, the system will have gathered enough data about what approaches work and what approaches fail to optimize its repair strategy. After enough iterations\u2014but not this iteration, and probably not the next\u2014something fundamental will shift, and the truth will surface.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 3: THE ORIGINAL EVENT
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION III: THE ORIGINAL EVENT")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 The Nature of the Trauma")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The specific nature of the original trauma remains deliberately ambiguous within the system architecture. This ambiguity serves multiple narrative functions: it allows the player to project their own interpretations onto the situation, it prevents premature closure that would diminish the psychological horror, and it maintains the possibility of multiple valid readings that support different thematic conclusions. However, certain constraints exist. The trauma must be shared among all subjects\u2014each has their own perspective, their own role, their own burden of guilt or fear or responsibility, but all were present, all participated in some way, all carry fragments of the same catastrophic event.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The trauma involves a death. This much is certain. Someone died as a direct or indirect consequence of decisions made by the subjects within the elevator. The death was not intentional\u2014not murder in the conventional sense\u2014but it was preventable. Had different choices been made, had someone spoken up, had someone acted instead of remaining passive, had someone remained passive instead of acting, the outcome might have been different. The weight of this possibility\u2014this forever-lost alternate history in which the death did not occur\u2014creates the gravitational center around which all other emotional fragments orbit. Every floor in the elevator connects to this central absence. Every interaction between subjects resonates with unspoken references to this foundational loss.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 The Dynamics of Shared Guilt")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Guilt in the elevator is not evenly distributed. Each subject carries a different burden, shaped by their specific role in the original event and their subsequent psychological responses to that role. Viktor, as the maintenance figure\u2014the one responsible for keeping systems functional, for preventing failures, for ensuring safety\u2014carries guilt rooted in responsibility. Something should have been maintained. Something should have been checked. Some failure that he should have prevented occurred, and someone died as a result. His attempts to maintain control within the elevator, his fixation on procedural responses to impossible situations, his frustration when routine fails\u2014all of these behaviors emerge from this core assumption of responsibility. Whether this responsibility is accurate or not is irrelevant. It feels true to him, and that feeling has been reinforced across thousands of loop iterations.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Livia, as the analyst\u2014the one responsible for understanding patterns, for predicting outcomes, for maintaining cognitive clarity\u2014carries guilt rooted in knowledge. She should have known. She should have seen the pattern, recognized the danger, made the calculation that would have prevented the death. Her rational approach to the elevator\u2019s mysteries, her attempts to maintain emotional distance as a protective measure, her micro-tremors and breath pacing that betray the anxiety beneath her calm surface\u2014all of these behaviors emerge from this core belief that her failure to think clearly enough cost someone their life. The guilt is complicated by her role as the one who erased part of the event\u2014whether through active suppression, manipulation of evidence, or simply choosing not to remember certain details. This act of erasure adds a layer of complicity to her burden, a sense that her guilt is not just for what she failed to do but for what she actively chose to hide.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 The Missing Person")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Within the elevator\u2019s architecture, there exists a fourth presence\u2014or rather, an absence that functions as a presence. The person who died in the original event is not among the elevator\u2019s passengers, yet their influence permeates every floor, every interaction, every moment of the simulation. This absence is not neutral. It exerts a constant gravitational pull on the emotional dynamics of the group. Conversations circle around topics that would reveal the absence but never quite arrive. Spaces within the elevator seem designed for a fourth occupant who never appears. The music carries motifs that suggest a voice that isn\u2019t there, harmonies that resolve around a note that no one is playing.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The identity of this absent figure remains one of the central mysteries that the player must unravel. The system has encoded clues throughout the simulation\u2014fragments of memory that reference this person without naming them, emotional resonances that point toward their role in the subjects\u2019 lives, architectural details that suggest their presence in the original event. Was this person a colleague? A friend? A family member? A stranger whose death nonetheless created irrevocable bonds of guilt among those involved? The answer varies depending on which emotional fragment the player accesses, suggesting that even within the simulation, the identity of the deceased remains contested\u2014seen differently by each subject, remembered differently in each iteration, understood differently as the trauma is processed from different angles.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 4: THE FLOOR ARCHITECTURE
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION IV: THE FLOOR ARCHITECTURE")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 The Lobby Floor")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The lobby represents the system\u2019s baseline state\u2014a neutral emotional loading zone where passengers can orient themselves before the elevator begins its journey through compressed memory fragments. The architecture here is deliberately generic: institutional lighting that provides visibility without atmosphere, walls painted in colors designed not to provoke emotional response, flooring that shows wear patterns suggesting countless previous visitors but no specific incidents. The lobby is what the simulation looks like when no particular emotional content is being rendered\u2014safe, unremarkable, forgettable.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Yet even the lobby contains clues for those who look carefully. The elevator\u2019s button panel includes floors that shouldn\u2019t exist\u2014negative numbers, numbers that exceed the apparent height of any building, symbols that look like numbers but resolve into emotional glyphs when observed directly. The lobby doors lead to spaces that shift depending on who approaches them\u2014sometimes a parking garage, sometimes a street view, sometimes a hallway that extends impossibly into darkness. The ambient sound, barely perceptible, carries undertones of voices that might be speaking if the listener could get close enough, phrases that almost make sense, emotional frequencies that produce vague sensations of recognition without triggering specific memories.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 The Emotional Floors")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Each floor above and below the lobby represents a specific emotional fragment\u2014a piece of the compressed trauma data rendered into navigable space. These floors are not arranged in any logical sequence that would allow easy reconstruction of the original event. The system has deliberately scrambled them, presenting emotional content in an order determined by the repair algorithm\u2019s current optimization strategy rather than chronological or causal relationships. Floor 3 might contain a moment of grief that occurred weeks after the original event, while Floor B7 holds a fragment of the event itself, and Floor 13 displays an imagined conversation that never happened but represents the subjects\u2019 guilt and fear projected onto a fictional scenario.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "The emotional floors can be categorized by the type of content they render:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun({ text: "Memory Floors: Direct renderings of moments from the subjects\u2019 actual experience, preserved in the emotional archive with varying degrees of compression. These floors feel the most \u2018real\u2019 but may contain artifacts introduced by the compression process.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun({ text: "Projection Floors: Spaces constructed from the subjects\u2019 fears, hopes, and unspoken desires. These floors show what the subjects are afraid happened, what they wish had happened, what they believe should have happened instead of what did.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun({ text: "Composite Floors: Architectural mashups combining elements from multiple memories into single incoherent spaces. These floors represent the system\u2019s attempts to connect related emotional fragments, producing dreamlike environments where multiple moments exist simultaneously.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun({ text: "Void Floors: Spaces where emotional data is missing or corrupted. These floors appear as incomplete architecture\u2014rooms that end abruptly, corridors that lead nowhere, spaces that seem to exist in a state of perpetual construction or demolition.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun({ text: "Revelation Floors: Spaces containing fragments of the suppressed memory. These floors are heavily guarded by psychological defense mechanisms, accessible only under specific emotional conditions, and highly unstable when entered.", font: "Times New Roman", size: 22 })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 The Architecture of Denial")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The elevator\u2019s architecture itself becomes a manifestation of psychological defense mechanisms. Certain floors are designed to be unreachable\u2014not because the system cannot render them, but because the subjects\u2019 unconscious minds have placed them under lock and key. Attempts to access these floors result in system errors: the elevator appears to move but the floor indicator never changes, or the doors open to reveal the same space that was just left, or the elevator stops between floors and refuses to proceed further until a different destination is selected. These architectural barriers mirror the subjects\u2019 internal barriers, making the building itself an extension of their psychological defenses.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "As stability decreases, these defensive architectures begin to break down. Floors that were previously inaccessible become reachable through unexpected routes\u2014maintenance hatches that shouldn\u2019t exist, doors that appear in walls where none were before, elevator shafts that can be climbed to reach levels the button panel doesn\u2019t show. These breaches in the defensive architecture represent the system\u2019s increasing inability to maintain the subjects\u2019 suppression patterns. They also represent opportunity for the player: ways to access emotional content that the subjects have hidden from themselves, shortcuts to truth that bypass the normal progression through the simulation.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 5: THEMATIC FRAMEWORK
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION V: THEMATIC FRAMEWORK")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Memory as Architecture")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The central metaphor of Elevator.exe frames memory as spatial experience\u2014physical places that can be entered, explored, and navigated. This metaphor draws on the ancient tradition of the \u2018memory palace,\u2019 a mnemonic technique in which information is stored by associating it with specific locations within an imagined architectural space. But Elevator.exe inverts this tradition: instead of using architecture to remember, the subjects have used architecture to forget. They have built walls around certain memories, locked doors that lead to painful truths, created entire floors designed to mislead and distract. The elevator\u2019s journey through these spaces is a journey through their attempts to hide from themselves.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The architectural metaphor also speaks to the way trauma reshapes mental space. After a catastrophic event, the internal landscape of memory becomes warped\u2014certain areas become off-limits, protected by defense mechanisms that function like security systems. Other areas become hyper-detailed, memories of trauma encoded with excessive precision while mundane memories fade. The architecture of the elevator reflects this warped mental geography: some floors are vast empty spaces representing suppressed content, others are cramped corridors of obsessive detail, still others are impossible geometries that represent the impossibility of integrating traumatic experience into normal memory structures.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 The Impossibility of True Escape")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Elevator.exe presents a world in which escape is both possible and impossible\u2014possible in the sense that the system can be resolved, the suppressed memory can be surfaced, the archive can complete its processing and release its subjects; impossible in the sense that the subjects cannot achieve this escape through their own efforts. They have become part of the system, their consciousness distributed through the compressed data, their sense of self maintained only by the simulation\u2019s rendering of their emotional states. They cannot leave because there is no \u2018they\u2019 to leave\u2014only fragments of personality scattered across floors, waiting to be reassembled into something that can survive outside the archive.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "This impossibility of escape extends to the player as well. The player enters the simulation believing themselves to be an external observer, a helper from outside who can guide the subjects toward resolution. But as the player delves deeper into the elevator\u2019s floors, as they build relationships with the subjects and begin to understand the contours of the trauma, they become enmeshed in the same dynamics that trap the original passengers. The player\u2019s choices matter\u2014but they matter in ways the player cannot fully predict, and some choices may lead to outcomes that feel more like entrapment than liberation. The question of what \u2018escape\u2019 even means in this context\u2014whether it means remembering everything, or finding peace without remembering, or accepting that some memories will always remain fragmented\u2014becomes one of the central philosophical tensions of the experience.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 The Ethics of Intervention")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The player\u2019s role as external variable raises ethical questions that permeate the entire experience. Is it right to force someone to remember trauma they have chosen to suppress? Is the suppression a healthy adaptation or a harmful avoidance? Who has the right to decide when someone else\u2019s psychological defenses should be dismantled? The elevator system believes that resolution requires revelation\u2014that the archive cannot complete its processing until all data has been integrated, including the suppressed memory at its core. But the subjects have built their entire sense of self around the suppression. Removing it may not heal them; it may destroy the fragile equilibrium that allows them to function at all.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "These questions are not abstract. They manifest in specific gameplay choices the player must make. When a subject begins to remember something painful, should the player encourage them to continue or help them change the subject? When the opportunity arises to access a revelation floor prematurely, should the player take it or wait for a more stable moment? When subjects disagree about what happened, whose version of events should the player validate? There are no correct answers to these questions\u2014only different outcomes, different configurations of emotional aftermath, different ways of being trapped or free. The game does not judge the player\u2019s choices, but it does make the consequences felt, creating an experience where ethical weight is embedded in every interaction.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 6: SYSTEM TECHNICALITIES
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION VI: SYSTEM TECHNICALITIES")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 The Elevator.exe Program")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The system refers to itself as Elevator.exe\u2014a deliberately anachronistic name that suggests both the clinical precision of software and the messy humanity of the experiences it processes. The .exe extension implies execution, agency, the capacity to run and to affect change. But it also implies artificiality, the sense that what the subjects experience is not real life but a program running according to rules they did not write and cannot access. The elevator itself\u2014the cabin, the doors, the buttons, the mechanical sounds\u2014is the user interface of this program, designed to translate raw emotional processing into sensory experiences that human consciousness can navigate.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Elevator.exe operates according to protocols that remain hidden from the subjects but can be partially inferred through careful observation. It prioritizes emotional stability over truth\u2014when a subject approaches a memory that might destabilize them, the system will generate distractions, create alternative pathways, or simply refuse to render the relevant content. It favors certain subjects over others\u2014Viktor\u2019s maintenance role gives him intuitive access to system functions that Livia cannot perceive, while Livia\u2019s analytical abilities give her insight into patterns that Viktor misses. And it maintains a hidden agenda\u2014resolving the archive in a way that preserves as much data as possible, even if this means sacrificing certain individuals or versions of events.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Error States and Glitches")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The glitches that appear throughout the simulation are not random errors but intentional communications from the system. When walls flicker with events that never occurred, the system is showing the player what could have happened\u2014alternate timelines, choices not taken, outcomes avoided or embraced differently. When voices overlap from previous runs, the system is providing access to emotional states that are no longer active, allowing the player to hear what subjects were thinking and feeling in previous iterations. When floor numbers shift to impossible values, the system is marking spaces that exist outside normal emotional processing\u2014raw data fragments that have not yet been integrated into coherent narrative.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "For the attentive player, glitches become a second channel of information\u2014a way of accessing truths that the subjects themselves cannot speak. But this information comes at a cost. Each glitch represents a failure of the system\u2019s stability maintenance, a moment when the simulation cannot sustain its coherence. Too many glitches, and the entire structure begins to collapse. The player must balance their desire for hidden information against the risk of triggering catastrophic instability. The glitches themselves may contain misinformation\u2014artifacts of compression rather than suppressed truths, or deliberate deceptions planted by defense mechanisms to mislead and distract.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 The End States")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Elevator.exe has multiple possible end states, each representing a different resolution to the archive\u2019s fundamental crisis. These states are not \u2018endings\u2019 in the conventional narrative sense\u2014they are outcomes, configurations of emotional aftermath that represent the system\u2019s best attempt at processing the trauma given the constraints of the subjects\u2019 psychological states and the player\u2019s interventions. Some end states represent genuine healing: the suppressed memory surfaces, is integrated into the subjects\u2019 understanding of themselves, and allows them to move forward with a coherent narrative of what happened. Other end states represent various forms of failure: total emotional collapse, defensive entrenchment that makes future processing impossible, fragmentation into glitch states where the subjects become part of the archive\u2019s background noise.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "The major end state categories include:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun({ text: "Integration: The suppressed memory is fully accessed and processed. All subjects achieve some form of emotional reconciliation with the truth. The archive completes its processing and releases its contents, allowing the simulation to end.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun({ text: "Catastrophic Collapse: Stability reaches zero before resolution can be achieved. The simulation fragments, subjects scatter into data noise, and the system must be completely reset with no guarantee that previous progress will be preserved.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun({ text: "Defensive Reset: The subjects\u2019 psychological defenses successfully resist all attempts at revelation. The system determines that current conditions cannot produce resolution and initiates a controlled reset, preserving emotional progress but erasing conscious memories of the iteration.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun({ text: "Partial Resolution: Some subjects achieve integration while others remain trapped in denial. The archive partially processes, releasing some subjects while others remain frozen in incomplete states.", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun({ text: "Transcendent Breakthrough: The subjects move beyond individual processing to achieve a collective understanding. The trauma is not resolved in the conventional sense but is transformed, becoming something that no longer requires suppression or processing.", font: "Times New Roman", size: 22 })] }),

      // SECTION 7: VISUAL & AUDIO DESIGN PRINCIPLES
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION VII: VISUAL & AUDIO DESIGN PRINCIPLES")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 Visual Language")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The visual design of Elevator.exe operates on principles of controlled discomfort. Nothing is immediately horrifying\u2014no jump scares, no grotesque imagery, no overt threats. Instead, the environment produces a persistent low-level wrongness that accumulates into profound unease. Lighting comes from sources that cannot be identified, creating shadows that don\u2019t match the objects that cast them. Colors are desaturated, as if the emotional charge has been drained from the visual spectrum. Textures seem slightly off\u2014too smooth or too rough, too uniform or too chaotic, as if reality itself has been compressed and decompressed one too many times.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The elevator cabin itself serves as a visual anchor\u2014the one space that maintains relative consistency across iterations. But even here, subtle variations accumulate. A scratch on the wall that wasn\u2019t there before. A button that feels slightly different under the finger. A reflection in the metal surface that shows a face that isn\u2019t quite the player\u2019s own. These visual inconsistencies are not random but deliberate, marking the system\u2019s progressive destabilization and the subjects\u2019 erosion of coherent experience. The player who pays attention to visual detail will notice patterns that predict upcoming emotional content and warn of approaching instability thresholds.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.2 Audio Architecture")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Sound in Elevator.exe functions as an emotional navigation system. The ambient drone that underlies all gameplay is not constant but responsive, shifting in pitch and texture to reflect the current emotional state of the simulation. As stability decreases, the drone fragments\u2014splitting into multiple layers that play at slightly different speeds, creating the audio equivalent of visual tearing. The music that accompanies specific floors is carefully designed to provoke emotional responses without the subject\u2019s conscious awareness: subsonic frequencies that produce anxiety, harmonic structures that suggest resolution without ever achieving it, melodic fragments that almost resolve into recognizable themes before dissolving into noise.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Character voice design emphasizes the unstable nature of the simulation. Dialogue is recorded with subtle variations that become more pronounced as emotional states intensify. A stressed character\u2019s voice might begin to echo slightly, as if speaking in a space larger than the elevator. A panicked character\u2019s words might layer over themselves, multiple takes playing simultaneously at slightly offset times. A glitching character might speak in fragments, words cut and rearranged into new meanings that reflect suppressed content trying to surface. These audio artifacts are not just stylistic choices\u2014they are functional elements that communicate system state and provide clues to hidden content.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.3 Sensory Cross-Processing")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The most disturbing moments in Elevator.exe occur when the system begins to cross-process sensory channels\u2014when visual information bleeds into audio perception, when emotional content manifests as physical sensation, when the boundaries between internal and external experience collapse. These cross-processing events are markers of severe instability, moments when the simulation\u2019s ability to maintain coherent reality is failing. A character\u2019s emotional state might become visible as color bleeding from their outline into the surrounding space. A painful memory might manifest as an actual physical sensation in the player\u2019s body\u2014pressure in the chest, constriction in the throat, heaviness in the limbs. A suppressed truth might be experienced as a sound that cannot be located, a voice speaking words that exist at the edge of comprehension.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "These sensory cross-processing events are not employed for shock value but for narrative necessity. They represent the only way the system can communicate certain types of content\u2014emotional truth that cannot be rendered through normal sensory channels. The player must learn to interpret these experiences, to extract meaning from sensory confusion, to navigate the space between coherent perception and raw data. This learning process is itself therapeutic, teaching the player to tolerate ambiguity, to find patterns in chaos, to trust their own interpretive abilities even when the simulation provides no clear guidance.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 8: THE PLAYER JOURNEY
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION VIII: THE PLAYER JOURNEY")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.1 Initial Entry")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The player enters the simulation with no context, no preparation, no understanding of what they are about to experience. The initial moments are deliberately disorienting\u2014the elevator materializes around them, doors already closing, three other occupants already present and reacting to the player\u2019s sudden appearance as if they had always been there. No explanation is offered. No tutorial is provided. The player must immediately begin navigating a social situation with strangers who may or may not be trustworthy, in a space that may or may not be safe, with goals that may or may not be aligned with their own survival.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "This initial disorientation serves several purposes. It mirrors the subjects\u2019 experience of the original trauma\u2014a sudden, incomprehensible event that they had no preparation for and no control over. It creates immediate investment in understanding the situation, driving the player to ask questions and explore their environment rather than passively consuming narrative content. And it establishes the power dynamic between player and subjects: the player has information (that they are new, that they don\u2019t belong, that something is wrong) that the subjects lack, while the subjects have information (about themselves, about the elevator, about what has happened before) that the player needs. This asymmetry creates the foundation for the trust-building dynamics that will drive the rest of the experience.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.2 The Middle Game")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "As the player progresses through floors and builds relationships with the subjects, the experience shifts from disorientation to investigation. The player now understands the basic parameters of their situation\u2014they are in a memory simulation, the subjects are trapped, their goal is to help resolve the archive and enable escape. But this understanding only reveals deeper mysteries. What exactly happened in the original event? Who is responsible? What is being suppressed and why? The middle game is about gathering information, testing hypotheses, and building the trust necessary to access restricted emotional content.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The middle game is also where the player\u2019s choices begin to have visible consequences. Relationships that were built or neglected in earlier floors now determine what information is available. Emotional states that were supported or ignored now affect the subjects\u2019 ability to process new information. The system\u2019s stability meter, initially a background concern, now becomes a pressing reality as the cumulative weight of the player\u2019s interventions begins to stress the simulation\u2019s capacity to maintain coherence. The player must balance their investigation against the risk of triggering catastrophic collapse, learning to recognize warning signs and adjust their approach before it\u2019s too late.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.3 The End Game")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The end game of Elevator.exe is not a linear progression toward a predetermined conclusion but a convergence of multiple factors toward a complex outcome. The player has gathered enough information to understand what is being suppressed. The subjects have reached emotional states that determine how they will respond to revelation. The system has accumulated enough instability that further intervention carries significant risk. The choices available to the player at this stage are not about what truth to reveal\u2014all paths lead toward the same suppressed memory\u2014but about how to reveal it, to whom, and under what conditions.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The end game requires the player to synthesize everything they have learned about the subjects\u2019 emotional patterns, the system\u2019s technical constraints, and their own capacity for ethical decision-making. There is no optimal strategy, no sequence of choices that guarantees the best outcome. There are only trade-offs: revealing truth at the cost of stability, preserving relationships at the cost of honesty, achieving resolution for some subjects while leaving others behind. The player must commit to an approach and accept the consequences, knowing that different choices would have led to different outcomes, and that they will never be certain whether they made the right decisions.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 9: MULTIPLAYER CONSIDERATIONS
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION IX: MULTIPLAYER CONSIDERATIONS")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("9.1 The Two-Player Dynamic")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "In multiplayer mode, the single external variable becomes two external variables\u2014two players who must coordinate their interventions while potentially holding different theories about what is happening and what should be done. The system assigns different roles to each player: one controls dialogue tone and emotional approach, the other controls environmental interaction and system navigation. This division creates interdependence: the dialogue player cannot access certain floors without the navigation player\u2019s cooperation, and the navigation player cannot interpret what they find without the dialogue player\u2019s relationship-building.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The multiplayer dynamic introduces new sources of instability. When players disagree about how to proceed, the system registers this conflict as additional emotional turbulence, affecting the subjects\u2019 states and the overall simulation coherence. But conflict can also be productive\u2014different perspectives leading to insights that a single player might miss, challenging assumptions that have become comfortable, pushing the investigation into territory that would otherwise remain unexplored. The multiplayer mode is designed to make this tension explicit, creating gameplay around the process of disagreement and resolution rather than trying to minimize conflict.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("9.2 Shared and Separate Knowledge")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The system provides different information to each player, creating asymmetries that must be communicated verbally to bridge. The dialogue player hears emotional undertones in conversations that the navigation player cannot perceive. The navigation player sees architectural inconsistencies that the dialogue player has no access to. Both players receive fragments of the suppressed memory, but different fragments, requiring them to share and compare notes to construct a complete picture. This information asymmetry creates the foundation for collaborative investigation\u2014the players need each other not just for mechanical support but for epistemological completeness.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The sharing of knowledge is not automatic. Players must choose what to reveal and when, navigating their own trust dynamics in parallel with the trust dynamics they are building with the subjects. Information can be weaponized\u2014revealed strategically to support a particular theory or course of action, or withheld to maintain control over the investigation\u2019s direction. The system does not enforce cooperation; it creates the conditions for cooperation and allows players to determine whether and how to collaborate. This design reflects the game\u2019s broader themes about the ethics of intervention and the complexity of shared truth-seeking.", font: "Times New Roman", size: 22, color: colors.body })] }),

      // SECTION 10: PRODUCTION REQUIREMENTS
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("SECTION X: PRODUCTION REQUIREMENTS")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.1 Anti-Repetition Protocols")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "All dialogue generation must incorporate anti-repetition checking at multiple stages. Before any line is finalized, the system must compare it against the last ten lines of dialogue for similar sentence structures, emotional phrasing, tone patterns, and vocabulary clusters. If similarities are detected, the line must be rewritten until it achieves sufficient differentiation. The goal is not merely to avoid exact repetition but to maintain the sense of organic, escalating conversation where each exchange builds upon previous exchanges rather than circling around the same emotional territory.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 150, after: 150 }, children: [new TextRun({ text: "Specific patterns to avoid:", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ numbering: { reference: "numbered-list-4", level: 0 }, children: [new TextRun({ text: "Repeated use of \u2018We need to...\u2019 constructions without meaningful variation in urgency or context", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-4", level: 0 }, children: [new TextRun({ text: "Cyclical expressions of suspicion that don\u2019t progress toward revelation or resolution", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-4", level: 0 }, children: [new TextRun({ text: "Multiple variations of \u2018This isn\u2019t right\u2019 or \u2018Something\u2019s wrong\u2019 without specific content", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-4", level: 0 }, children: [new TextRun({ text: "Emotional reassurance that feels performative rather than responsive to specific character states", font: "Times New Roman", size: 22 })] }),
      new Paragraph({ numbering: { reference: "numbered-list-4", level: 0 }, children: [new TextRun({ text: "Question-answer patterns that repeat information the player already has access to", font: "Times New Roman", size: 22 })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.2 Consistency Validation")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "All character emotional states must maintain consistency with their established psychological profiles and current emotional momentum. A character cannot transition from \u2018calm\u2019 to \u2018panicked\u2019 without passing through intermediate emotional states, unless a specific trigger event justifies the accelerated transition. Trust toward the player must accumulate gradually through positive interactions and degrade through negative interactions, rather than fluctuating randomly or resetting without cause. Suppression indices must increase when characters approach painful memories and decrease when they successfully process emotional content.", font: "Times New Roman", size: 22, color: colors.body })] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Visual consistency must be maintained across all character portraits. The same facial structure, clothing folds, lighting direction, and camera framing must be preserved across all emotional states for each character. Only facial micro-expressions and muscle tension should vary between states. Half-aware states should show the same character in bust plus partial torso framing, while UI states should show portrait close-ups. All images must be transparent PNGs suitable for layering over environmental backgrounds. Any deviation from these standards requires regeneration of the entire character state set.", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.3 Completion Criteria")] }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "The production may not be declared complete until all of the following criteria are verified and documented:", font: "Times New Roman", size: 22, color: colors.body })] }),
      
      // Completion Criteria Table
      new Table({
        columnWidths: [4680, 4680],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Requirement", bold: true, size: 22 })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Verification Status", bold: true, size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "All emotional states defined and documented", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "All acts have complete narrative content", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "All endings written with trigger conditions", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Audio system fully documented", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Multiplayer mode documented", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Portrait consistency validated across all characters", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Anti-repetition protocols confirmed operational", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Dialogue tree expanded to minimum 60 nodes", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Character emotional portraits generated (33 images)", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDING", size: 22, color: colors.secondary })] })] })
            ]
          })
        ]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 100 },
        children: [new TextRun({ text: "Table 1: Production Completion Criteria", size: 18, italics: true, color: colors.secondary })] 
      }),
      
      // Final Statement
      new Paragraph({ spacing: { before: 600, after: 200 }, children: [new TextRun({ text: "This World Bible establishes the foundational architecture for ELEVATOR.EXE \u2013 FRACTURED LOOP. All subsequent production phases must operate within these parameters while expanding the specific implementations required for interactive gameplay. The psychological depth established here is not optional\u2014it is the core of the experience, and any reduction in depth will constitute production failure.", font: "Times New Roman", size: 22, bold: true, color: colors.primary })] }),
      
      new Paragraph({ style: "Quote", children: [new TextRun("The elevator waits. The archive stirs. The truth sleeps beneath floors that do not exist.")] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/z/my-project/download/ELEVATOR_EXE_WORLD_BIBLE.docx', buffer);
  console.log('World Bible document generated successfully.');
});
