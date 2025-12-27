import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/common/ToastContainer";
import { getMetadata } from "../api-helpers/consultation";

import DashboardView from "../views/DashboardView";
import ConsultationChatView from "../views/ConsultationChatView";
import ConsultationRecordsView from "../views/ConsultationRecordsView";
import PatientDetailView from "../views/PatientDetailView";
import BeginAssessmentView from "../views/BeginAssessmentView";
import ProfileView from "../views/ProfileView";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentProtocol, setCurrentProtocol] = useState("Sore Throat Service");
  const [assessmentData, setAssessmentData] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationMetadata, setConsultationMetadata] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [isLoadingConsultation, setIsLoadingConsultation] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  // Map protocol names to condition slugs
  const getConditionSlug = (protocolName) => {
    const protocolMap = {
      "Sore Throat Service": "sore-throat",
      "Seasonal Flu": "seasonal-flu",
      "Headache & Migraine": "headache-migraine",
      "Stomach Pain": "stomach-pain",
      "Body Pain": "body-pain",
    };
    return protocolMap[protocolName] || protocolName.toLowerCase().replace(/\s+/g, "-");
  };

  const launchConsultation = async (protocol) => {
    setIsLoadingConsultation(true);
    setCurrentProtocol(protocol);
    setAssessmentData(null);
    setConsultationMetadata(null);
    setConsultationData(null);

    try {
      const conditionSlug = getConditionSlug(protocol);
      // Step 1: Get metadata only
      const result = await getMetadata(conditionSlug);

      if (result.success) {
        setConsultationMetadata(result.data);
        setActiveTab("begin-assessment");
        addToast(`Launched ${protocol} consultation`, "success");
      } else {
        addToast(result.error || `Failed to fetch metadata for ${protocol}`, "error");
      }
    } catch (error) {
      console.error("Error launching consultation:", error);
      addToast(`Failed to launch ${protocol} consultation. Please try again.`, "error");
    } finally {
      setIsLoadingConsultation(false);
    }
  };

  const openPatientDetail = (patient) => {
    setSelectedPatient(patient);
    setActiveTab("patientDetail");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        addToast={addToast}
      />

      <div className="flex-1 flex flex-col">
        <Header
          activeTab={activeTab}
          addToast={addToast}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Render views based on activeTab */}
          {activeTab === "dashboard" && (
            <DashboardView
              setActiveTab={setActiveTab}
              addToast={addToast}
              launchConsultation={launchConsultation}
              isLoadingConsultation={isLoadingConsultation}
            />
          )}
          {activeTab === "begin-assessment" && (
            <BeginAssessmentView
              protocol={currentProtocol}
              metadata={consultationMetadata}
              onComplete={(answers, consultationData) => {
                setAssessmentData(answers);
                setConsultationData(consultationData);
                setActiveTab("chat");
                addToast("Assessment completed successfully", "success");
              }}
              addToast={addToast}
            />
          )}

          {activeTab === "chat" && (
            <ConsultationChatView
              protocol={currentProtocol}
              metadata={consultationMetadata}
              consultationData={consultationData}
              assessmentData={assessmentData}
              onEnd={() => {
                setActiveTab("dashboard");
                setAssessmentData(null);
                setConsultationMetadata(null);
                setConsultationData(null);
              }}
              addToast={addToast}
            />
          )}

          {activeTab === "records" && (
            <ConsultationRecordsView addToast={addToast} />
          )}

          {activeTab === "patientDetail" && selectedPatient && (
            <PatientDetailView
              patient={selectedPatient}
              onBack={() => setActiveTab("patients")}
              addToast={addToast}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView />
          )}

        </main>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
}
