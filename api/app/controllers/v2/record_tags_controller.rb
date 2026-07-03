# frozen_string_literal: true

module V2
  class RecordTagsController < ApplicationController
    before_action :set_record

    def create
      classification = Classification.find(params[:classification_id])
      @record.record_classifications.find_or_create_by!(
        classification: classification,
        classifier: 'manual',
        confidence: 1.0,
        auto_tagged: false
      )
      head :created
    end

    def destroy
      classification = Classification.find(params[:id])
      rc = @record.record_classifications.find_by!(classification: classification)
      rc.destroy!
      head :no_content
    end

    private

    def set_record
      @record = current_user.records.find(params[:record_id])
    end
  end
end