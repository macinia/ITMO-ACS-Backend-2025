export interface CreateReviewRequest {
    rentalAgreementId: number;
    rating: number;
    comment?: string;
}