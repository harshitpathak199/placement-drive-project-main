import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Allocation, Company, Student } from '../types';

interface NetworkGraphProps {
  allocations: Allocation[];
  companies: Company[];
  unplaced: Student[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ allocations, companies, unplaced }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1000;
    const height = 700;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("cursor", "grab");

    // Add a container group for zooming
    const g = svg.append("g");

    // Add Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Prepare Data
    const nodes: any[] = [
      ...companies.map(c => ({ id: c.id, group: 'company', name: c.name, r: 35 })),
      ...allocations.map(a => ({ id: a.studentId, group: 'student', name: a.studentName, r: 10 })),
      ...unplaced.map(s => ({ id: s.id, group: 'unplaced', name: s.name, r: 8 }))
    ];

    const links: any[] = allocations.map(a => ({
      source: a.studentId,
      target: a.companyId
    }));

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.r + 15).strength(0.7))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    // Definitions for gradients/glows
    const defs = svg.append("defs");
    
    // Glow filter
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Draw Links
    const link = g.append("g")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Draw Nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => {
        if (d.group === 'company') return '#4f46e5'; 
        if (d.group === 'student') return '#10b981'; 
        return '#f43f5e'; 
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", (d: any) => d.group === 'company' ? "url(#glow)" : "none")
      .style("cursor", "pointer")
      .call(drag(simulation) as any);

    // Labels
    const labels = g.append("g")
      .style("pointer-events", "none")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.name)
      .attr("font-size", (d: any) => d.group === 'company' ? "12px" : "8px")
      .attr("font-weight", (d: any) => d.group === 'company' ? "700" : "500")
      .attr("fill", (d: any) => d.group === 'company' ? "#1e293b" : "#475569")
      .attr("text-anchor", "middle")
      .attr("dy", (d: any) => d.group === 'company' ? 5 : d.r + 12);

    // Interaction: Hover Highlight
    node.on("mouseover", (event: any, d: any) => {
      const connectedIds = new Set();
      connectedIds.add(d.id);
      
      // Find neighbors
      links.forEach((l: any) => {
        if (l.source.id === d.id) connectedIds.add(l.target.id);
        if (l.target.id === d.id) connectedIds.add(l.source.id);
      });

      // Dim others
      node.transition().duration(200).style("opacity", (o: any) => 
        connectedIds.has(o.id) ? 1 : 0.1
      );
      link.transition().duration(200).style("opacity", (l: any) => 
        (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.05
      ).attr("stroke", (l: any) => 
        (l.source.id === d.id || l.target.id === d.id) ? "#4f46e5" : "#94a3b8"
      );
      labels.transition().duration(200).style("opacity", (o: any) => 
        connectedIds.has(o.id) ? 1 : 0.1
      );
    })
    .on("mouseout", () => {
      // Reset
      node.transition().duration(200).style("opacity", 1);
      link.transition().duration(200).style("opacity", 0.4).attr("stroke", "#94a3b8");
      labels.transition().duration(200).style("opacity", 1);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
        
      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        svg.style("cursor", "grabbing");
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
        svg.style("cursor", "grab");
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [allocations, companies, unplaced]);

  return (
    <div className="w-full h-[600px] border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-50 relative group">
       <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50"></div>
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-2 select-none">
        <div className="font-semibold text-slate-900 mb-1">Topology Map</div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm ring-2 ring-indigo-100"></span>
            <span className="text-slate-600">Company (Hub)</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm ring-2 ring-emerald-100"></span>
            <span className="text-slate-600">Placed Student</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm ring-2 ring-rose-100"></span>
            <span className="text-slate-600">Unplaced Student</span>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
           Scroll to Zoom • Drag to Pan
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default NetworkGraph;