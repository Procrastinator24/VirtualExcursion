export interface Tag {
    id: number,
    name: string,
    slug?: string,
    description?: string,
    createdAt?: string,
    scenesCount?: number
}

// public int Id { get; set; }
// public string Name { get; set; }
// public string Slug { get; set; }
// public string? Description { get; set; }
// public DateTime CreatedAt { get; set; }
// public int ScenesCount { get; set; }