#!/usr/bin/env python3
"""
Generate Mermaid flow diagrams from structured flow definitions.

Usage:
    python generate_flow.py --input flow_definition.json --output flow_diagram.mmd
    
Flow definition format (JSON):
{
    "title": "User Login Flow",
    "start": "launch",
    "nodes": [
        {"id": "launch", "label": "User Opens App", "type": "start"},
        {"id": "check_auth", "label": "Check Authentication", "type": "decision"},
        {"id": "dashboard", "label": "Dashboard", "type": "screen"},
        {"id": "login", "label": "Login Screen", "type": "screen"}
    ],
    "edges": [
        {"from": "launch", "to": "check_auth"},
        {"from": "check_auth", "to": "dashboard", "label": "Authenticated"},
        {"from": "check_auth", "to": "login", "label": "Not Authenticated"}
    ]
}
"""

import json
import argparse
from typing import Dict, List, Any


class FlowDiagramGenerator:
    """Generate Mermaid diagrams from flow definitions."""
    
    NODE_SHAPES = {
        'start': ('[', ']'),        # Rounded rectangle
        'screen': ('[', ']'),       # Rectangle
        'decision': ('{', '}'),     # Diamond
        'process': ('[', ']'),      # Rectangle
        'end': ('([', '])'),        # Stadium (pill shape)
        'error': ('[/', '/]'),      # Parallelogram
    }
    
    def __init__(self, flow_def: Dict[str, Any]):
        self.flow_def = flow_def
        self.nodes = {node['id']: node for node in flow_def.get('nodes', [])}
        self.edges = flow_def.get('edges', [])
        
    def generate(self) -> str:
        """Generate Mermaid diagram syntax."""
        lines = ['graph TD']
        
        # Add title as comment if present
        if 'title' in self.flow_def:
            lines.append(f"    %% {self.flow_def['title']}")
            lines.append("")
        
        # Define nodes
        for node_id, node in self.nodes.items():
            label = node.get('label', node_id)
            node_type = node.get('type', 'screen')
            shape_open, shape_close = self.NODE_SHAPES.get(node_type, ('[', ']'))
            
            lines.append(f"    {node_id}{shape_open}{label}{shape_close}")
        
        lines.append("")
        
        # Define edges
        for edge in self.edges:
            from_node = edge['from']
            to_node = edge['to']
            label = edge.get('label', '')
            
            if label:
                lines.append(f"    {from_node} -->|{label}| {to_node}")
            else:
                lines.append(f"    {from_node} --> {to_node}")
        
        return '\n'.join(lines)
    
    def validate(self) -> List[str]:
        """Validate flow definition and return list of issues."""
        issues = []
        
        # Check required fields
        if 'nodes' not in self.flow_def or not self.flow_def['nodes']:
            issues.append("No nodes defined")
            
        if 'edges' not in self.flow_def or not self.flow_def['edges']:
            issues.append("No edges defined")
            
        # Check edge references
        node_ids = set(self.nodes.keys())
        for i, edge in enumerate(self.edges):
            if edge['from'] not in node_ids:
                issues.append(f"Edge {i}: 'from' node '{edge['from']}' not found")
            if edge['to'] not in node_ids:
                issues.append(f"Edge {i}: 'to' node '{edge['to']}' not found")
        
        # Check for disconnected nodes
        connected_nodes = set()
        for edge in self.edges:
            connected_nodes.add(edge['from'])
            connected_nodes.add(edge['to'])
        
        disconnected = node_ids - connected_nodes
        if disconnected:
            issues.append(f"Disconnected nodes: {', '.join(disconnected)}")
        
        return issues


def main():
    parser = argparse.ArgumentParser(
        description='Generate Mermaid flow diagrams from JSON definitions'
    )
    parser.add_argument(
        '--input', '-i',
        required=True,
        help='Input JSON file with flow definition'
    )
    parser.add_argument(
        '--output', '-o',
        required=True,
        help='Output file for Mermaid diagram (.mmd)'
    )
    parser.add_argument(
        '--validate-only',
        action='store_true',
        help='Only validate the flow definition without generating output'
    )
    
    args = parser.parse_args()
    
    # Load flow definition
    try:
        with open(args.input, 'r') as f:
            flow_def = json.load(f)
    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found")
        return 1
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in input file: {e}")
        return 1
    
    # Generate diagram
    generator = FlowDiagramGenerator(flow_def)
    
    # Validate
    issues = generator.validate()
    if issues:
        print("Validation issues found:")
        for issue in issues:
            print(f"  - {issue}")
        if args.validate_only or issues:
            return 1 if issues else 0
    
    if args.validate_only:
        print("Validation passed!")
        return 0
    
    # Generate and save
    diagram = generator.generate()
    
    try:
        with open(args.output, 'w') as f:
            f.write(diagram)
        print(f"Diagram generated successfully: {args.output}")
        print("\nPreview:")
        print(diagram)
        return 0
    except IOError as e:
        print(f"Error writing output file: {e}")
        return 1


if __name__ == '__main__':
    exit(main())
