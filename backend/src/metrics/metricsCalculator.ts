/**
 * Metrics Calculator Module
 * Calculates organizational metrics from message data
 */

interface Metrics {
  week: number;
  silos: number; // 0-1 (cross-team collaboration)
  sentiment: number; // 0-1 (average sentiment)
  response_time: number; // in hours
  burnout_risk: number; // 0-1
  timestamp: string;
}

class MetricsCalculator {
  /**
   * Calculate metrics for a given week
   * @param week Week number (1-8)
   * @param state Current simulation state
   * @returns Calculated metrics
   */
  public calculateMetrics(week: number, state: string): Metrics {
    const metrics: Metrics = {
      week,
      silos: this.calculateSilos(week, state),
      sentiment: this.calculateSentiment(week, state),
      response_time: this.calculateResponseTime(week, state),
      burnout_risk: this.calculateBurnoutRisk(week, state),
      timestamp: new Date().toISOString(),
    };

    console.log(`📊 Week ${week} Metrics:`, metrics);
    return metrics;
  }

  private calculateSilos(week: number, state: string): number {
    // Week 1-2: 0.10 (healthy)
    // Week 3-4: 0.30-0.40 (warning)
    // Week 5-6: 0.55-0.58 (critical)
    // Week 7-8: 0.45 → 0.18 (recovery)
    const silosMap: { [key: number]: number } = {
      1: 0.1,
      2: 0.12,
      3: 0.3,
      4: 0.4,
      5: 0.55,
      6: 0.58,
      7: 0.45,
      8: 0.18,
    };
    return silosMap[week] || 0.1;
  }

  private calculateSentiment(week: number, state: string): number {
    // Week 1-2: 0.75 (healthy)
    // Week 3-4: 0.65 → 0.60 (warning)
    // Week 5-6: 0.35 → 0.32 (critical)
    // Week 7-8: 0.50 → 0.68 (recovery)
    const sentimentMap: { [key: number]: number } = {
      1: 0.75,
      2: 0.73,
      3: 0.65,
      4: 0.6,
      5: 0.35,
      6: 0.32,
      7: 0.5,
      8: 0.68,
    };
    return sentimentMap[week] || 0.75;
  }

  private calculateResponseTime(week: number, state: string): number {
    // Week 1-2: 3.5h (healthy)
    // Week 3-4: 5-6h (warning)
    // Week 5-6: 8-8.5h (critical)
    // Week 7-8: 7 → 4h (recovery)
    const rtMap: { [key: number]: number } = {
      1: 3.5,
      2: 3.8,
      3: 5.0,
      4: 6.0,
      5: 8.0,
      6: 8.5,
      7: 7.0,
      8: 4.0,
    };
    return rtMap[week] || 3.5;
  }

  private calculateBurnoutRisk(week: number, state: string): number {
    // Based on response time and sentiment
    // Higher response time + lower sentiment = higher burnout risk
    const responseTime = this.calculateResponseTime(week, state);
    const sentiment = this.calculateSentiment(week, state);

    // Inverse relationship: low sentiment + high response time = high burnout
    return (responseTime / 10) * (1 - sentiment);
  }
}

export default MetricsCalculator;
