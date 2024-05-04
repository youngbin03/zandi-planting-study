export interface ContributionDto {
    date: string
    count: number;
}

export interface ContributionSummaryDto {
    total: Record<string, number>
    contributions: ContributionDto[]
}