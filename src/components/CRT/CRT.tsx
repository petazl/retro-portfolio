import "./CRT.css";

/** Full-screen CRT overlay. Render inside the (position: relative) desktop. */
function CRT() {
  return (
    <>
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-hum" aria-hidden="true" />
    </>
  );
}

export default CRT;
