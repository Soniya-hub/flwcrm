// src/components/ui/Table.js
import React from "react";

export const Table = ({ children, className }) => <table className={className}>{children}</table>;
export const TableHeader = ({ children }) => <thead>{children}</thead>;
export const TableRow = ({ children, className }) => <tr className={className}>{children}</tr>;
export const TableHead = ({ children }) => <th>{children}</th>;
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
export const TableCell = ({ children }) => <td>{children}</td>;