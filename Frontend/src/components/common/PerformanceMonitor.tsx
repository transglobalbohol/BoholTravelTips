import React, { useEffect, useState } from 'react';
import { Activity, Zap, Clock } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  cacheHits: number;
  totalRequests: number;
}

interface PerformanceMonitorProps {
  componentName: string;
  showMetrics?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  componentName, 
  showMetrics = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    cacheHits: 0,
    totalRequests: 1
  });
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const renderStartTime = performance.now();
    
    // Simulate performance measurement
    const measurePerformance = () => {
      const loadTime = Date.now() - startTime;
      const renderTime = performance.now() - renderStartTime;
      
      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime * 10) / 10,
        cacheHits: Math.floor(Math.random() * 5) + 3, // Mock cache hits
        totalRequests: Math.floor(Math.random() * 3) + 1
      });
    };

    // Use requestAnimationFrame for accurate measurement
    requestAnimationFrame(measurePerformance);
  }, [startTime]);

  if (!showMetrics) {
    return null;
  }

  const cacheHitRate = Math.round((metrics.cacheHits / metrics.totalRequests) * 100);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm z-50 max-w-xs">
      <div className="flex items-center space-x-2 mb-3">
        <Activity className="w-4 h-4 text-green-600" />
        <span className="font-medium text-gray-900">Performance</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Component:</span>
          <span className="font-medium text-gray-900 text-xs">{componentName}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span className="text-gray-600">Load Time:</span>
          </div>
          <span className={`font-medium ${metrics.loadTime < 200 ? 'text-green-600' : 'text-yellow-600'}`}>
            {metrics.loadTime}ms
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-purple-600" />
            <span className="text-gray-600">Render:</span>
          </div>
          <span className={`font-medium ${metrics.renderTime < 50 ? 'text-green-600' : 'text-yellow-600'}`}>
            {metrics.renderTime}ms
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Cache Rate:</span>
          <span className={`font-medium ${cacheHitRate > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
            {cacheHitRate}%
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${metrics.loadTime < 200 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-xs text-gray-500">
            {metrics.loadTime < 200 ? 'Excellent' : 'Good'} Performance
          </span>
        </div>
      </div>
    </div>
  );
};

// Higher-order component to wrap components with performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const PerformanceWrappedComponent: React.FC<P & { showPerformanceMetrics?: boolean }> = ({
    showPerformanceMetrics = false,
    ...props
  }) => {
    return (
      <>
        <WrappedComponent {...(props as P)} />
        <PerformanceMonitor 
          componentName={componentName} 
          showMetrics={showPerformanceMetrics}
        />
      </>
    );
  };

  PerformanceWrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  
  return PerformanceWrappedComponent;
};

export default PerformanceMonitor;