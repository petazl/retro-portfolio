import "./AboutWindow.css";

import { useCustomScrollbar } from "../../hooks/useCustomScrollbar";

const ACADEMIC_INTERESTS = [
  "Computer Architecture",
  "ASIC Design",
  "Embedded Systems",
  "FPGA",
  "SoC Design",
  "VLSI",
  "RTL & Verification",
  "Silicon Photonics",
  "Digital Systems",
  "Power Electronics",
];

function AboutWindow() {
  const {
    contentRef,
    trackRef,
    thumbHeight,
    thumbOffset,
    update,
    scrollBy,
    startThumbDrag,
    dragThumb,
    stopThumbDrag,
    handleTrackPointerDown,
  } = useCustomScrollbar();

  return (
    <div className="about-window-body">
      <div
        ref={contentRef}
        className="about-window-content"
        onScroll={update}
      >
        <h1>Richmond</h1>

        <p className="about-role">Electrical & Electronic Engineering Student</p>

        <p>University of Warwick</p>

        <hr />

        <section className="about-section">
          <h2>Profile</h2>

          <p>
            I'm an Electrical & Electronic Engineering student at the
            University of Warwick with a strong interest in computer
            architecture, embedded systems and digital hardware.
          </p>

          <p>
            I enjoy working on projects that sit between hardware and
            software, particularly where I can design, build and test systems
            from the ground up.
          </p>

          <p>
            Outside of university, I'm involved in engineering teams,
            technical societies and personal projects that let me explore
            hardware beyond the curriculum.
          </p>
        </section>

        <section className="about-section">
          <h2>Education</h2>

          <div className="about-entry">
            <h3>University of Warwick</h3>

            <p className="about-meta">MEng Electrical & Electronic Engineering</p>

            <p>
              Currently studying Electrical & Electronic Engineering, with
              coursework spanning semiconductor devices, signal processing,
              systems and software engineering, and electrical & electronic
              design.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>Projects</h2>

          <div className="about-entry">
            <h3>Tetra32</h3>

            <p>
              A long-term personal computer architecture project centred
              around a custom 32-bit instruction set architecture. The project
              explores CPU design, programming languages, RTL, verification,
              FPGA implementation and eventually ASIC design.
            </p>
          </div>

          <div className="about-entry">
            <h3>Warwick Moto</h3>

            <p>
              Control Systems and Modelling Lead Engineer working on an
              electric race motorcycle. My work covers inverter and VCU
              systems, motor testing, dyno analysis, modelling, data
              acquisition and vehicle electronics.
            </p>
          </div>

          <div className="about-entry">
            <h3>Redactify</h3>

            <p>
              A Python-based document and image redaction application
              combining a graphical interface with AI-assisted functionality.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>Academic Interests</h2>

          <div className="about-tags">
            {ACADEMIC_INTERESTS.map((interest) => (
              <span key={interest}>{interest}</span>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Teams & Activities</h2>

          <div className="about-entry">
            <h3>Warwick Moto</h3>

            <p>Control Systems and Modelling Lead Engineer.</p>
          </div>

          <div className="about-entry">
            <h3>University of Warwick Electronics Society</h3>

            <p>
              Founder / organiser, working to build a community around
              electronics, embedded systems and practical engineering
              projects.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>Hobbies & Interests</h2>

          <p>
            Outside engineering, I enjoy motorcycles, fitness, volleyball,
            arcade and rhythm games, and exploring computer hardware and
            technology.
          </p>

          <p>
            I also enjoy building small projects simply because they're
            interesting — particularly things involving electronics,
            programming or unusual hardware.
          </p>
        </section>

        <section className="about-section">
          <h2>Currently Learning</h2>

          <p>
            C++, computer architecture, RTL design, SystemVerilog, FPGA
            development and hardware/software co-design.
          </p>
        </section>

        <hr />

        <p className="about-footer">Thanks for stopping by.</p>
      </div>

      {/* Custom scrollbar */}

      <div className="about-scrollbar" aria-label="About Me scrollbar">
        <button
          type="button"
          className="about-scrollbar-button about-scrollbar-button-up"
          aria-label="Scroll up"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => scrollBy(-48)}
        >
          <span aria-hidden="true" />
        </button>

        <div
          ref={trackRef}
          className="about-scrollbar-track"
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={handleTrackPointerDown}
        >
          <button
            type="button"
            className="about-scrollbar-thumb"
            aria-label="Drag to scroll"
            style={{
              height: thumbHeight,
              transform: `translateY(${thumbOffset}px)`,
            }}
            onPointerDown={startThumbDrag}
            onPointerMove={dragThumb}
            onPointerUp={stopThumbDrag}
            onPointerCancel={stopThumbDrag}
          />
        </div>

        <button
          type="button"
          className="about-scrollbar-button about-scrollbar-button-down"
          aria-label="Scroll down"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => scrollBy(48)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default AboutWindow;
