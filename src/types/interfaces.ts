interface Match {
  /* Start index of the match */
  readonly start: number;
  /* End index of the match */
  readonly end?: number;
  /* Start index of the body */
  readonly bodyStart: number;
  /* End index of the body */
  readonly bodyEnd?: number;
  /* Matched string */
  readonly match?: string;
  /* List of nested matches */
  readonly children: Match[];
}

interface Token extends Match {
  // internal use
  readonly parent: Match[];
}
