import { useState, useMemo, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState(() => {
    return localStorage.getItem("utilsflow_subnet_ip") || "192.168.1.1";
  });
  const [cidr, setCidr] = useState(() => {
    return localStorage.getItem("utilsflow_subnet_cidr") || "24";
  });

  useEffect(() => {
    localStorage.setItem("utilsflow_subnet_ip", ipAddress);
  }, [ipAddress]);

  useEffect(() => {
    localStorage.setItem("utilsflow_subnet_cidr", cidr);
  }, [cidr]);

  const results = useMemo(() => {
    // Basic IP validation
    const ipParts = ipAddress.split(".").map(Number);
    if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
      return null;
    }
    const mask = parseInt(cidr);
    if (isNaN(mask) || mask < 0 || mask > 32) {
      return null;
    }

    // IP to 32-bit Integer
    const ipInt = (ipParts[0] << 24) >>> 0 | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

    // Netmask Integer
    const maskInt = mask === 0 ? 0 : (~0 << (32 - mask)) >>> 0;

    // Wildcard Mask Integer
    const wildcardInt = ~maskInt >>> 0;

    // Network ID Integer
    const networkInt = (ipInt & maskInt) >>> 0;

    // Broadcast ID Integer
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    // Helper: Int to IP String
    const intToIp = (num) => [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join(".");

    // Helper: Int to Binary String
    const intToBinary = (num) => {
      const str = (num >>> 0).toString(2).padStart(32, "0");
      return `${str.slice(0, 8)}.${str.slice(8, 16)}.${str.slice(16, 24)}.${str.slice(24, 32)}`;
    };

    const totalHosts = mask >= 31 ? 0 : Math.pow(2, 32 - mask) - 2;
    const firstHost = mask >= 31 ? "N/A" : intToIp(networkInt + 1);
    const lastHost = mask >= 31 ? "N/A" : intToIp(broadcastInt - 1);

    return {
      networkAddress: intToIp(networkInt),
      broadcastAddress: intToIp(broadcastInt),
      netmask: intToIp(maskInt),
      wildcard: intToIp(wildcardInt),
      usableRange: `${firstHost} - ${lastHost}`,
      totalHosts: totalHosts.toLocaleString(),
      binaryIp: intToBinary(ipInt),
      binaryMask: intToBinary(maskInt)
    };
  }, [ipAddress, cidr]);

  return (
    <ToolLayout
      toolId="subnet-calculator"
      title="IP Subnet Calculator"
      description="Inspect IPv4 subnets, identify usable host scopes, check netmasks, and translate IP addresses to binary blocks client-side."
      path="/tools/subnet-calculator"
      category="developer"
      categoryPath="/?cat=developer"
    >
      <div className="tool-box">
        <div className="editor-grid">
          
          {/* Inputs */}
          <div>
            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "16px", textTransform: "uppercase" }}>
              📡 Input IPv4 & Mask
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="label" htmlFor="sub-ip">IP Address</label>
                <input
                  id="sub-ip"
                  type="text"
                  className="input-field"
                  value={ipAddress}
                  onChange={e => setIpAddress(e.target.value)}
                  placeholder="e.g. 192.168.1.1"
                />
              </div>

              <div>
                <label className="label" htmlFor="sub-cidr">Subnet CIDR Mask</label>
                <select id="sub-cidr" className="input-field" value={cidr} onChange={e => setCidr(e.target.value)}>
                  {Array.from({ length: 33 }).map((_, idx) => (
                    <option key={idx} value={idx}>/{idx}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "16px", textTransform: "uppercase" }}>
              📊 Subnet Specifications
            </h4>
            {results ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Network Address:</span>
                  <strong style={{ color: "var(--primary-light)" }}>{results.networkAddress}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Usable Host Range:</span>
                  <strong>{results.usableRange}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Broadcast Address:</span>
                  <strong>{results.broadcastAddress}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Subnet Mask:</span>
                  <strong>{results.netmask}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Wildcard Mask:</span>
                  <strong>{results.wildcard}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Total Usable Hosts:</span>
                  <strong style={{ color: "var(--primary-light)" }}>{results.totalHosts}</strong>
                </div>
                
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "8px", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Binary IP:</span>
                  <div style={{ fontFamily: "monospace", fontSize: "12px", background: "rgba(0,0,0,0.2)", padding: "4px 8px", borderRadius: "4px", marginTop: "2px" }}>
                    {results.binaryIp}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Binary Mask:</span>
                  <div style={{ fontFamily: "monospace", fontSize: "12px", background: "rgba(0,0,0,0.2)", padding: "4px 8px", borderRadius: "4px", marginTop: "2px" }}>
                    {results.binaryMask}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: "#ef5350", fontSize: "13px" }}>⚠️ Invalid IP Address Format. Enter 4 octets separated by dots (0-255).</p>
            )}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default SubnetCalculator;
export { SubnetCalculator };
