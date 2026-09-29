import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    # MySQL connection parameters
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "experimentflow"
    db_url: str = ""

    # Local AI Configuration
    local_ai_base_url: str = "http://localhost:11434"
    local_ai_model: str = "llama3:latest"
    local_ai_timeout: int = 15

    # Storage Paths
    upload_dir: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    datasets_dir: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "datasets")

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def database_url(self) -> str:
        if self.db_url:
            return self.db_url
        if self.mysql_password:
            return f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"
        return f"mysql+pymysql://{self.mysql_user}@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"

settings = Settings()
